// backend/routes/ventasRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db"); // tu backend/db.js

// Inserción de venta (igual que antes)
router.post("/", async (req, res) => {
  const client = await db.pool.connect();
  try {
    const venta = req.body;
    await client.query("BEGIN");

    const insertVentaText = `
      INSERT INTO ventas(
        usuario_id, usuario_nombre, usuario_email, metodo_pago, tipo_entrega,
        subtotal, iva, recargo_envio, total, estado, notas
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING id, fecha_creacion;
    `;

    const ventaVals = [
      venta.usuario_id || null,
      venta.usuario_nombre || (venta.usuario_cliente && venta.usuario_cliente.nombre) || null,
      venta.usuario_email || (venta.usuario_cliente && venta.usuario_cliente.email) || null,
      venta.metodoPago || venta.metodo_pago || null,
      venta.tipoEntrega || venta.tipo_entrega || null,
      parseFloat(venta.subtotal || 0),
      parseFloat(venta.iva || 0),
      parseFloat(venta.recargo_envio || 0),
      parseFloat(venta.total || 0),
      "pendiente",
      venta.notas || null
    ];

    const r = await client.query(insertVentaText, ventaVals);
    const ventaId = r.rows[0].id;

    const insertDetalleText = `
      INSERT INTO detalle_venta (venta_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    if (Array.isArray(venta.items)) {
      for (const item of venta.items) {
        const precioUnit = parseFloat(item.precio_unitario ?? item.precio ?? 0);
        const cantidad = parseInt(item.cantidad ?? 1, 10);
        const subtotalItem = parseFloat((precioUnit * cantidad).toFixed(2));
        await client.query(insertDetalleText, [
          ventaId,
          item.id || null,
          item.nombre || item.nombre_producto || null,
          cantidad,
          precioUnit,
          subtotalItem
        ]);
      }
    }

    await client.query("COMMIT");
    res.status(201).json({ ok: true, id: ventaId, fecha_creacion: r.rows[0].fecha_creacion });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error POST /api/ventas:", error);
    res.status(500).json({ ok: false, error: "Error guardando venta" });
  } finally {
    client.release();
  }
});

// Listar ventas (filtro por estado y búsqueda simple)
router.get("/", async (req, res) => {
  try {
    const { estado, search } = req.query;
    let q = "SELECT * FROM ventas";
    const params = [];

    if (estado) {
      params.push(estado);
      q += ` WHERE estado = $${params.length}`;
    }

    if (search) {
      const searchLower = `%${search.toLowerCase()}%`;
      if (params.length === 0) {
        q += ` WHERE (LOWER(usuario_nombre) LIKE $1 OR CAST(id AS TEXT) LIKE $2 OR LOWER(usuario_email) LIKE $3)`;
        params.push(searchLower, `%${search}%`, searchLower);
      } else {
        q += ` AND (LOWER(usuario_nombre) LIKE $${params.length+1} OR CAST(id AS TEXT) LIKE $${params.length+2} OR LOWER(usuario_email) LIKE $${params.length+3})`;
        params.push(searchLower, `%${search}%`, searchLower);
      }
    }

    q += " ORDER BY fecha_creacion DESC LIMIT 2000";
    const r = await db.query(q, params);
    res.json(r.rows);
  } catch (err) {
    console.error("GET /api/ventas error:", err);
    res.status(500).json({ error: "error" });
  }
});

// Obtener venta + detalles
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const ventaRes = await db.query("SELECT * FROM ventas WHERE id = $1", [id]);
    if (ventaRes.rowCount === 0) return res.status(404).json({ error: "Venta no encontrada" });
    const venta = ventaRes.rows[0];
    const detalles = (await db.query("SELECT * FROM detalle_venta WHERE venta_id = $1", [id])).rows;
    res.json({ venta, detalles });
  } catch (err) {
    console.error("GET /api/ventas/:id error:", err);
    res.status(500).json({ error: "error" });
  }
});

/*
 PATCH /api/ventas/:id
 Soporta:
  - Cambiar estado (pendiente, en_proceso, confirmada, rechazada)
  - Asignar cajero_id
  - fecha_confirmacion
  - notas

 Si el estado solicitado es "confirmada", intenta decrementar stock de productos (si existe columna productos.stock).
 Esto se hace dentro de una transacción y falla si hay stock insuficiente.
*/
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const { estado, cajero_id, fecha_confirmacion, notas } = req.body;
  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    // Si se quiere confirmar, validar y decrementar stock
    if (estado === "confirmada") {
      // obtener detalles de la venta
      const detallesRes = await client.query("SELECT * FROM detalle_venta WHERE venta_id = $1", [id]);
      const detalles = detallesRes.rows;

      // Para cada item que tenga producto_id intentamos decrementar stock
      for (const det of detalles) {
        if (!det.producto_id) continue;
        // verificar stock actual
        const pRes = await client.query("SELECT stock FROM productos WHERE id = $1 FOR UPDATE", [det.producto_id]);
        if (pRes.rowCount === 0) {
          await client.query("ROLLBACK");
          return res.status(400).json({ ok: false, error: `Producto id ${det.producto_id} no encontrado` });
        }
        const stockActual = Number(pRes.rows[0].stock ?? 0);
        if (stockActual < det.cantidad) {
          await client.query("ROLLBACK");
          return res.status(400).json({ ok: false, error: `Stock insuficiente para producto ${det.nombre_producto} (id ${det.producto_id})` });
        }
        // decrementar stock
        await client.query("UPDATE productos SET stock = stock - $1 WHERE id = $2", [det.cantidad, det.producto_id]);
      }
    }

    // Actualizar la fila de ventas
    const q = `
      UPDATE ventas
      SET
        estado = COALESCE($1, estado),
        cajero_id = COALESCE($2, cajero_id),
        fecha_confirmacion = COALESCE($3, fecha_confirmacion),
        notas = COALESCE($4, notas)
      WHERE id = $5
      RETURNING *;
    `;
    const values = [estado || null, cajero_id || null, fecha_confirmacion || null, notas || null, id];
    const r = await client.query(q, values);
    if (r.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ ok: false, error: "Venta no encontrada" });
    }

    await client.query("COMMIT");
    res.json({ ok: true, venta: r.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("PATCH /api/ventas/:id error:", err);
    res.status(500).json({ ok: false, error: "Error actualizando venta" });
  } finally {
    client.release();
  }
});

module.exports = router;
