// backend/controllers/pedidosController.js
const db = require("../db");

// Crear pedido
const crearPedido = async (req, res) => {
  try {
    const { userId, productos, total, metodoPago, datosEnvio, notas, estado } = req.body;

    if (!userId || !productos || productos.length === 0) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    // Usar estado enviado por frontend o 'pagado' por defecto para no requerir confirmación del cajero
    const estadoFinal = estado || "pagado";

    const insertSql = `INSERT INTO pedidos (user_id, total, fecha, estado, metodo_pago, direccion_envio, notas) 
                       VALUES (?, ?, NOW(), ?, ?, ?, ?)`;
    const insertParams = [userId, total, estadoFinal, metodoPago || "efectivo", datosEnvio || "", notas || ""];

    const [result] = await db.query(insertSql, insertParams);

    // Obtener insertId de forma defensiva (mysql2)
    let pedidoId = null;
    if (result && (result.insertId || (Array.isArray(result) && result[0] && result[0].insertId))) {
      pedidoId = result.insertId || (result[0] && result[0].insertId);
    }

    // Fallback a LAST_INSERT_ID()
    if (!pedidoId) {
      try {
        const [rowsLast] = await db.query("SELECT LAST_INSERT_ID() as id");
        if (rowsLast && rowsLast[0] && rowsLast[0].id) pedidoId = rowsLast[0].id;
      } catch (e) {
        // noop
      }
    }

    // Guardar detalles
    for (const p of productos) {
      await db.query(
        `INSERT INTO pedidos_detalles (pedido_id, producto_id, cantidad, precio, subtotal) 
         VALUES (?, ?, ?, ?, ?)`,
        [pedidoId, p.id, p.cantidad, p.precio, (p.precio * p.cantidad)]
      );
    }

    res.status(201).json({
      message: "Pedido creado con éxito",
      pedidoId,
      numeroFactura: `FAC-${String(pedidoId).padStart(6, "0")}`
    });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(500).json({ message: "Error al crear pedido" });
  }
};

// Obtener pedidos por cliente
const obtenerPedidosCliente = async (req, res) => {
  try {
    const { userId } = req.params;

    const [pedidos] = await db.query(
      `SELECT 
        p.id,
        p.total,
        p.fecha,
        p.estado,
        p.metodo_pago,
        p.direccion_envio,
        p.notas,
        CONCAT('FAC-', LPAD(p.id, 6, '0')) as numero_factura,
        COUNT(pd.id) as total_items
       FROM pedidos p
       LEFT JOIN pedidos_detalles pd ON p.id = pd.pedido_id
       WHERE p.user_id = ? 
       GROUP BY p.id
       ORDER BY p.fecha DESC`,
      [userId]
    );

    res.json(Array.isArray(pedidos) ? pedidos : []);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};

// Obtener detalle de pedido
const obtenerDetallePedido = async (req, res) => {
  try {
    const { pedidoId } = req.params;

    const [pedidoInfoRows] = await db.query(
      `SELECT 
        p.id,
        p.user_id,
        p.total,
        p.fecha,
        p.estado,
        p.metodo_pago,
        p.direccion_envio,
        p.notas,
        CONCAT('FAC-', LPAD(p.id, 6, '0')) as numero_factura,
        u.usuario_nombre,
        u.usuario_email,
        u.usuario_telefono
       FROM pedidos p
       INNER JOIN usuarios u ON p.user_id = u.id
       WHERE p.id = ?`,
      [pedidoId]
    );

    if (!pedidoInfoRows || pedidoInfoRows.length === 0) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    const pedido = pedidoInfoRows[0];

    const [detalles] = await db.query(
      `SELECT 
        pd.id,
        pd.producto_id,
        pd.cantidad,
        pd.precio,
        pd.subtotal,
        pr.nombre as producto_nombre,
        pr.descripcion as producto_descripcion,
        pr.imagen_url as producto_imagen
       FROM pedidos_detalles pd
       LEFT JOIN productos pr ON pd.producto_id = pr.id
       WHERE pd.pedido_id = ?`,
      [pedidoId]
    );

    res.json({
      pedido,
      detalles: Array.isArray(detalles) ? detalles : []
    });
  } catch (error) {
    console.error("Error al obtener detalle del pedido:", error);
    res.status(500).json({ message: "Error al obtener detalle del pedido" });
  }
};

module.exports = {
  crearPedido,
  obtenerPedidosCliente,
  obtenerDetallePedido
};
