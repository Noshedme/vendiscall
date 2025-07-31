//reclamosRoutes.js en routes en backend
const express = require("express");
const router = express.Router();
const {
  getReclamos,
  getReclamoById,
  createReclamo,
  updateReclamo,
  deleteReclamo,
  getEstadisticasReclamos,
  getReclamosByUsuario
} = require("../controllers/reclamosController");

// GET - Obtener todos los reclamos
router.get("/", getReclamos);

// GET - Obtener estadísticas de reclamos
router.get("/estadisticas", getEstadisticasReclamos);

// GET - Obtener reclamos por usuario
router.get("/usuario/:usuario_id", getReclamosByUsuario);

// GET - Obtener reclamo por ID
router.get("/:id", getReclamoById);

// POST - Crear nuevo reclamo
router.post("/", createReclamo);

// PUT - Actualizar reclamo
router.put("/:id", updateReclamo);

// DELETE - Eliminar reclamo
router.delete("/:id", deleteReclamo);

module.exports = router;