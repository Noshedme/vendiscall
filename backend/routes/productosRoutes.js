const express = require('express');
const {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} = require('../controllers/productosController');

const router = express.Router();

router.get('/', getProductos);
router.post('/', createProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

module.exports = router;
