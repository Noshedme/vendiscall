//carrito en backend/routes/carrito.js
const express = require("express");
const router = express.Router();
const carritoController = require("../controllers/carritoController");

// GET /api/carrito?cliente_id=123 - Obtener carrito del cliente
router.get("/", carritoController.getCarrito);

// POST /api/carrito/add - Agregar producto al carrito
router.post("/add", carritoController.addToCarrito);

// PUT /api/carrito/update - Actualizar cantidad de producto
router.put("/update", carritoController.updateCarrito);

// DELETE /api/carrito/remove - Eliminar producto del carrito
router.delete("/remove", carritoController.removeFromCarrito);

// DELETE /api/carrito/clear - Vaciar carrito completo
router.delete("/clear", carritoController.clearCarrito);

module.exports = router;