const db = require("../db");

exports.getCarrito = async (req, res) => {
  try {
    const { cliente_id } = req.query;
    if (!cliente_id) {
      return res.status(400).json({ error: "cliente_id es requerido", carrito: [] });
    }
    
    const result = await db.query(
      `SELECT c.id, c.producto_id, c.cantidad, 
              p.nombre, p.codigo, p.descripcion, p.precio, p.stock, p.categoria
       FROM carritos c
       JOIN productos p ON c.producto_id = p.id
       WHERE c.cliente_id = $1
       ORDER BY c.id ASC`,
      [cliente_id]
    );
    
    res.json({ success: true, carrito: result.rows });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ error: "Error interno del servidor", carrito: [] });
  }
};

exports.addToCarrito = async (req, res) => {
  try {
    const { cliente_id, producto_id, cantidad } = req.body;
    
    if (!cliente_id || !producto_id || !cantidad) {
      return res.status(400).json({ 
        success: false, 
        error: "cliente_id, producto_id y cantidad son requeridos" 
      });
    }

    // Verificar que el producto existe y tiene stock suficiente
    const productoResult = await db.query(
      `SELECT stock FROM productos WHERE id = $1`,
      [producto_id]
    );

    if (productoResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: "Producto no encontrado" 
      });
    }

    const stockDisponible = productoResult.rows[0].stock;
    if (cantidad > stockDisponible) {
      return res.status(400).json({ 
        success: false, 
        error: `Stock insuficiente. Solo hay ${stockDisponible} unidades disponibles` 
      });
    }

    // Insertar o actualizar en el carrito
    await db.query(
      `INSERT INTO carritos (cliente_id, producto_id, cantidad)
       VALUES ($1, $2, $3)
       ON CONFLICT (cliente_id, producto_id)
       DO UPDATE SET cantidad = $3`,
      [cliente_id, producto_id, cantidad]
    );
    
    res.json({ success: true, message: "Producto agregado al carrito" });
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
};

exports.updateCarrito = async (req, res) => {
  try {
    const { cliente_id, producto_id, cantidad } = req.body;
    
    if (!cliente_id || !producto_id || cantidad === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: "cliente_id, producto_id y cantidad son requeridos" 
      });
    }

    if (cantidad <= 0) {
      // Si la cantidad es 0 o menor, eliminar del carrito
      await db.query(
        `DELETE FROM carritos WHERE cliente_id = $1 AND producto_id = $2`,
        [cliente_id, producto_id]
      );
    } else {
      // Verificar stock disponible
      const productoResult = await db.query(
        `SELECT stock FROM productos WHERE id = $1`,
        [producto_id]
      );

      if (productoResult.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: "Producto no encontrado" 
        });
      }

      const stockDisponible = productoResult.rows[0].stock;
      if (cantidad > stockDisponible) {
        return res.status(400).json({ 
          success: false, 
          error: `Stock insuficiente. Solo hay ${stockDisponible} unidades disponibles` 
        });
      }

      // Actualizar cantidad
      await db.query(
        `UPDATE carritos SET cantidad = $3 
         WHERE cliente_id = $1 AND producto_id = $2`,
        [cliente_id, producto_id, cantidad]
      );
    }
    
    res.json({ success: true, message: "Carrito actualizado" });
  } catch (error) {
    console.error("Error al actualizar carrito:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
};

exports.removeFromCarrito = async (req, res) => {
  try {
    const { cliente_id, producto_id } = req.body;
    
    if (!cliente_id || !producto_id) {
      return res.status(400).json({ 
        success: false, 
        error: "cliente_id y producto_id son requeridos" 
      });
    }
    
    await db.query(
      `DELETE FROM carritos WHERE cliente_id = $1 AND producto_id = $2`,
      [cliente_id, producto_id]
    );
    
    res.json({ success: true, message: "Producto eliminado del carrito" });
  } catch (error) {
    console.error("Error al eliminar del carrito:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
};

exports.clearCarrito = async (req, res) => {
  try {
    const { cliente_id } = req.body;
    
    if (!cliente_id) {
      return res.status(400).json({ 
        success: false, 
        error: "cliente_id es requerido" 
      });
    }
    
    await db.query(`DELETE FROM carritos WHERE cliente_id = $1`, [cliente_id]);
    res.json({ success: true, message: "Carrito vaciado" });
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
};