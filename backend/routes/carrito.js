const express = require("express");
const router = express.Router();
const carritoController = require("../controllers/carritoController");

router.get("/", carritoController.getCarrito);
router.post("/add", carritoController.addToCarrito);
router.post("/remove", carritoController.removeFromCarrito);
router.post("/clear", carritoController.clearCarrito);

module.exports = router;