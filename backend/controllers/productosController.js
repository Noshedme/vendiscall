const pool = require("../db.js");

const getProductos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

const createProducto = async (req, res) => {
  const { codigo, nombre, descripcion, precio, stock, categoria } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO productos (codigo, nombre, descripcion, precio, stock, categoria)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [codigo, nombre, descripcion, precio, stock, categoria]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: error.message || "Error al crear producto" });
  }
};

const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { codigo, nombre, descripcion, precio, stock, categoria } = req.body;

  try {
    const result = await pool.query(
      `UPDATE productos SET codigo = $1, nombre = $2, descripcion = $3, precio = $4, stock = $5, categoria = $6
       WHERE id = $7
       RETURNING *`,
      [codigo, nombre, descripcion, precio, stock, categoria, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: error.message || "Error al actualizar producto" });
  }
};

const deleteProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM productos WHERE id = $1", [id]);

    if (result.rowCount === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.sendStatus(204);
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

module.exports = {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
};
