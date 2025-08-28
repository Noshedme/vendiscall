// backend/routes/historial.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Ajusta según tu configuración

// Obtener historial por ID de usuario (usuarios registrados)
router.get('/usuario/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Contar total de compras
    const [countRows] = await db.query('SELECT COUNT(*) as total FROM pedidos WHERE user_id = ?', [userId]);
    const totalItems = (countRows && countRows[0] && countRows[0].total) ? parseInt(countRows[0].total, 10) : 0;
    const totalPages = Math.ceil(totalItems / limit);

    // Obtener pedidos con información básica
    const [pedidos] = await db.query(`
      SELECT 
        p.id,
        p.user_id,
        p.total,
        p.fecha as fecha_compra,
        p.estado,
        p.metodo_pago,
        p.direccion_envio,
        p.notas,
        u.usuario_nombre,
        u.usuario_email,
        u.usuario_telefono,
        COUNT(pd.id) as total_items,
        CASE 
          WHEN p.direccion_envio IS NOT NULL AND p.direccion_envio != '' 
          THEN 'domicilio' 
          ELSE 'tienda' 
        END as tipo_entrega
      FROM pedidos p
      INNER JOIN usuarios u ON p.user_id = u.id
      LEFT JOIN pedidos_detalles pd ON p.id = pd.pedido_id
      WHERE p.user_id = ?
      GROUP BY p.id, u.usuario_nombre, u.usuario_email, u.usuario_telefono
      ORDER BY p.fecha DESC
      LIMIT ? OFFSET ?
    `, [userId, limit, offset]);

    const pedidosConEstados = (Array.isArray(pedidos) ? pedidos : []).map(pedido => ({
      ...pedido,
      subtotal: parseFloat(pedido.total) * 0.8,
      iva: parseFloat(pedido.total) * 0.2,
      recargo_envio: pedido.tipo_entrega === 'domicilio' ? 5.00 : 0,
      direccion_entrega: pedido.direccion_envio,
      ciudad: 'Ciudad extraída',
      codigo_postal: null,
      historial_estados: [
        {
          id: 1,
          estado_nuevo: pedido.estado,
          fecha_cambio: pedido.fecha_compra,
          comentario: `Pedido ${pedido.estado}`
        }
      ]
    }));

    res.json({
      success: true,
      compras: pedidosConEstados,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_items: totalItems,
        per_page: limit
      }
    });

  } catch (error) {
    console.error('Error al obtener historial por usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener historial por email (usuarios invitados)
router.get('/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [countRows] = await db.query(`
      SELECT COUNT(*) as total 
      FROM pedidos p
      INNER JOIN usuarios u ON p.user_id = u.id
      WHERE u.usuario_email = ?
    `, [email]);

    const totalItems = (countRows && countRows[0] && countRows[0].total) ? parseInt(countRows[0].total, 10) : 0;
    const totalPages = Math.ceil(totalItems / limit);

    const [pedidos] = await db.query(`
      SELECT 
        p.id,
        p.user_id,
        p.total,
        p.fecha as fecha_compra,
        p.estado,
        p.metodo_pago,
        p.direccion_envio,
        p.notas,
        u.usuario_nombre,
        u.usuario_email,
        u.usuario_telefono,
        COUNT(pd.id) as total_items,
        CASE 
          WHEN p.direccion_envio IS NOT NULL AND p.direccion_envio != '' 
          THEN 'domicilio' 
          ELSE 'tienda' 
        END as tipo_entrega
      FROM pedidos p
      INNER JOIN usuarios u ON p.user_id = u.id
      LEFT JOIN pedidos_detalles pd ON p.id = pd.pedido_id
      WHERE u.usuario_email = ?
      GROUP BY p.id, u.usuario_nombre, u.usuario_email, u.usuario_telefono
      ORDER BY p.fecha DESC
      LIMIT ? OFFSET ?
    `, [email, limit, offset]);

    const pedidosConEstados = (Array.isArray(pedidos) ? pedidos : []).map(pedido => ({
      ...pedido,
      subtotal: parseFloat(pedido.total) * 0.8,
      iva: parseFloat(pedido.total) * 0.2,
      recargo_envio: pedido.tipo_entrega === 'domicilio' ? 5.00 : 0,
      direccion_entrega: pedido.direccion_envio,
      ciudad: 'Ciudad extraída',
      codigo_postal: null,
      historial_estados: [
        {
          id: 1,
          estado_nuevo: pedido.estado,
          fecha_cambio: pedido.fecha_compra,
          comentario: `Pedido ${pedido.estado}`
        }
      ]
    }));

    res.json({
      success: true,
      compras: pedidosConEstados,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_items: totalItems,
        per_page: limit
      }
    });

  } catch (error) {
    console.error('Error al obtener historial por email:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener detalles de una compra específica
router.get('/:compraId', async (req, res) => {
  try {
    const { compraId } = req.params;

    const [pedidoInfoRows] = await db.query(`
      SELECT 
        p.id,
        p.user_id,
        p.total,
        p.fecha as fecha_compra,
        p.estado,
        p.metodo_pago,
        p.direccion_envio,
        p.notas,
        u.usuario_nombre,
        u.usuario_email,
        u.usuario_telefono,
        CASE 
          WHEN p.direccion_envio IS NOT NULL AND p.direccion_envio != '' 
          THEN 'domicilio' 
          ELSE 'tienda' 
        END as tipo_entrega
      FROM pedidos p
      INNER JOIN usuarios u ON p.user_id = u.id
      WHERE p.id = ?
    `, [compraId]);

    if (!pedidoInfoRows || pedidoInfoRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Compra no encontrada'
      });
    }

    const pedidoInfo = pedidoInfoRows[0];

    const [items] = await db.query(`
      SELECT 
        pd.id,
        pd.producto_id,
        pd.cantidad,
        pd.precio as precio_unitario,
        pd.subtotal as subtotal_item,
        pr.nombre as producto_nombre,
        pr.descripcion as producto_descripcion,
        pr.imagen_url as producto_imagen
      FROM pedidos_detalles pd
      LEFT JOIN productos pr ON pd.producto_id = pr.id
      WHERE pd.pedido_id = ?
    `, [compraId]);

    const compra = {
      ...pedidoInfo,
      subtotal: parseFloat(pedidoInfo.total) * 0.8,
      iva: parseFloat(pedidoInfo.total) * 0.2,
      recargo_envio: pedidoInfo.tipo_entrega === 'domicilio' ? 5.00 : 0,
      direccion_entrega: pedidoInfo.direccion_envio,
      ciudad: 'Ciudad extraída',
      codigo_postal: null,
      items: Array.isArray(items) ? items : [],
      historial_estados: [
        {
          id: 1,
          estado_nuevo: pedidoInfo.estado,
          fecha_cambio: pedidoInfo.fecha_compra,
          comentario: `Pedido ${pedidoInfo.estado}`
        }
      ]
    };

    res.json({
      success: true,
      compra: compra
    });

  } catch (error) {
    console.error('Error al obtener detalles de compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
