// backend/controllers/productosController.js
import pool from "../db.js";

// Obtener todos los productos
export const getProductos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

// Obtener un producto por ID
export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM productos WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

// Crear producto
export const createProducto = async (req, res) => {
  try {
    const { codigo, nombre, descripcion, precio, stock, categoria, imagen_url } = req.body;

    const result = await pool.query(
      `INSERT INTO productos (codigo, nombre, descripcion, precio, stock, categoria, imagen_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [codigo, nombre, descripcion, precio, stock, categoria, imagen_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

// Actualizar producto
export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, nombre, descripcion, precio, stock, categoria, imagen_url } = req.body;

    const result = await pool.query(
      `UPDATE productos 
       SET codigo = $1, nombre = $2, descripcion = $3, precio = $4, stock = $5, categoria = $6, imagen_url = $7
       WHERE id = $8 RETURNING *`,
      [codigo, nombre, descripcion, precio, stock, categoria, imagen_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

// Eliminar producto
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM productos WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};
