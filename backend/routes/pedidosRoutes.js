// backend/routes/pedidosRoutes.js
const express = require('express');
const router = express.Router();
const { crearPedido, obtenerPedidosCliente, obtenerDetallePedido } = require('../controllers/pedidosController');

// Rutas
router.post('/', crearPedido);
router.get('/cliente/:userId', obtenerPedidosCliente);
router.get('/detalle/:pedidoId', obtenerDetallePedido);

module.exports = router;
