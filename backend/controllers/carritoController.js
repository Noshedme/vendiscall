const db = require("../db");

exports.getCarrito = async (req, res) => {
  const { cliente_id } = req.query;
  if (!cliente_id) return res.status(400).json({ carrito: [] });
  const result = await db.query(
    `SELECT c.id, c.producto_id, c.cantidad, p.nombre, p.precio_unitario
     FROM carritos c
     JOIN productos p ON c.producto_id = p.id
     WHERE c.cliente_id = $1`,
    [cliente_id]
  );
  res.json({ carrito: result.rows });
};

exports.addToCarrito = async (req, res) => {
  const { cliente_id, producto_id, cantidad } = req.body;
  if (!cliente_id || !producto_id || !cantidad) return res.status(400).json({ success: false });
  await db.query(
    `INSERT INTO carritos (cliente_id, producto_id, cantidad)
     VALUES ($1, $2, $3)
     ON CONFLICT (cliente_id, producto_id)
     DO UPDATE SET cantidad = EXCLUDED.cantidad`,
    [cliente_id, producto_id, cantidad]
  );
  res.json({ success: true });
};

exports.removeFromCarrito = async (req, res) => {
  const { cliente_id, producto_id } = req.body;
  await db.query(
    `DELETE FROM carritos WHERE cliente_id = $1 AND producto_id = $2`,
    [cliente_id, producto_id]
  );
  res.json({ success: true });
};

exports.clearCarrito = async (req, res) => {
  const { cliente_id } = req.body;
  await db.query(`DELETE FROM carritos WHERE cliente_id = $1`, [cliente_id]);
  res.json({ success: true });
};