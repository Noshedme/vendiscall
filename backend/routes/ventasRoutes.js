// backend/routes/ventasRoutes.js (fragmento POST)
// ... código previo de inserción y commit ...

    // Crear ventaCompleta (igual que antes)
    const ventaCompleta = {
      id: ventaId,
      fecha_venta: r.rows[0].fecha_venta,
      usuario_id: venta.usuario_id,
      usuario_nombre: venta.usuario_nombre,
      usuario_email: venta.usuario_email,
      subtotal: parseFloat(venta.subtotal || 0),
      iva: parseFloat(venta.iva || 0),
      total: parseFloat(venta.total || 0),
      estado: "pendiente",
      metodoPago: venta.metodoPago,
      tipoEntrega: venta.tipoEntrega,
      items: venta.items
    };

    // <-- QUITAR req.io.emit para modo no-realtime
    // if (req.io) {
    //   req.io.emit('nueva_venta', ventaCompleta);
    // }

    res.status(201).json({
      ok: true,
      id: ventaId,
      fecha_venta: r.rows[0].fecha_venta,
      venta: ventaCompleta
    });
