//reclamosController.js en controllers en backend
const pool = require("../db.js");

// GET - Obtener todos los reclamos con información del usuario
const getReclamos = async (req, res) => {
  try {
    const query = `
      SELECT 
        r.id,
        r.mensaje,
        r.calificacion,
        r.fecha,
        u.nombres,
        u.apellidos,
        u.email,
        u.cedula,
        u.edificio,
        u.departamento
      FROM reclamos r
      INNER JOIN usuarios u ON r.usuario_id = u.id
      ORDER BY r.fecha DESC
    `;
    
    const result = await pool.query(query);
    
    // Formatear los datos para el frontend
    const reclamos = result.rows.map(reclamo => ({
      id: reclamo.id,
      nombre: `${reclamo.nombres} ${reclamo.apellidos}`,
      email: reclamo.email,
      cedula: reclamo.cedula,
      edificio: reclamo.edificio,
      departamento: reclamo.departamento,
      comentario: reclamo.mensaje,
      calificacion: reclamo.calificacion,
      fecha: reclamo.fecha
    }));
    
    res.json({
      success: true,
      data: reclamos
    });
  } catch (error) {
    console.error("Error al obtener reclamos:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

// GET - Obtener reclamo por ID
const getReclamoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        r.id,
        r.mensaje,
        r.calificacion,
        r.fecha,
        u.nombres,
        u.apellidos,
        u.email,
        u.cedula,
        u.celular,
        u.edificio,
        u.departamento
      FROM reclamos r
      INNER JOIN usuarios u ON r.usuario_id = u.id
      WHERE r.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reclamo no encontrado"
      });
    }
    
    const reclamo = result.rows[0];
    res.json({
      success: true,
      data: {
        id: reclamo.id,
        mensaje: reclamo.mensaje,
        calificacion: reclamo.calificacion,
        fecha: reclamo.fecha,
        usuario: {
          nombres: reclamo.nombres,
          apellidos: reclamo.apellidos,
          email: reclamo.email,
          cedula: reclamo.cedula,
          celular: reclamo.celular,
          edificio: reclamo.edificio,
          departamento: reclamo.departamento
        }
      }
    });
  } catch (error) {
    console.error("Error al obtener reclamo:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

// POST - Crear nuevo reclamo
const createReclamo = async (req, res) => {
  try {
    const { usuario_id, mensaje, calificacion } = req.body;

    // Validaciones
    if (!usuario_id || !mensaje || !calificacion) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios"
      });
    }

    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({
        success: false,
        message: "La calificación debe estar entre 1 y 5"
      });
    }

    // Verificar que el usuario existe
    const userExists = await pool.query("SELECT id FROM usuarios WHERE id = $1", [usuario_id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // Insertar reclamo
    const query = `
      INSERT INTO reclamos (usuario_id, mensaje, calificacion)
      VALUES ($1, $2, $3)
      RETURNING id, fecha
    `;

    const result = await pool.query(query, [usuario_id, mensaje, calificacion]);

    res.status(201).json({
      success: true,
      message: "Reclamo creado exitosamente",
      data: {
        id: result.rows[0].id,
        fecha: result.rows[0].fecha
      }
    });

  } catch (error) {
    console.error("Error al crear reclamo:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

// PUT - Actualizar reclamo (solo mensaje y calificación)
const updateReclamo = async (req, res) => {
  try {
    const { id } = req.params;
    const { mensaje, calificacion } = req.body;

    // Validaciones
    if (!mensaje || !calificacion) {
      return res.status(400).json({
        success: false,
        message: "Mensaje y calificación son obligatorios"
      });
    }

    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({
        success: false,
        message: "La calificación debe estar entre 1 y 5"
      });
    }

    // Verificar que el reclamo existe
    const reclamoExists = await pool.query("SELECT id FROM reclamos WHERE id = $1", [id]);
    if (reclamoExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reclamo no encontrado"
      });
    }

    // Actualizar reclamo
    const query = `
      UPDATE reclamos 
      SET mensaje = $1, calificacion = $2
      WHERE id = $3
      RETURNING id, fecha
    `;

    const result = await pool.query(query, [mensaje, calificacion, id]);

    res.json({
      success: true,
      message: "Reclamo actualizado exitosamente",
      data: {
        id: result.rows[0].id,
        fecha: result.rows[0].fecha
      }
    });

  } catch (error) {
    console.error("Error al actualizar reclamo:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

// DELETE - Eliminar reclamo
const deleteReclamo = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el reclamo existe
    const reclamoExists = await pool.query("SELECT id FROM reclamos WHERE id = $1", [id]);
    if (reclamoExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reclamo no encontrado"
      });
    }

    // Eliminar reclamo
    await pool.query("DELETE FROM reclamos WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "Reclamo eliminado exitosamente"
    });

  } catch (error) {
    console.error("Error al eliminar reclamo:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

// GET - Obtener estadísticas de reclamos
const getEstadisticasReclamos = async (req, res) => {
  try {
    const queries = await Promise.all([
      // Total de reclamos
      pool.query("SELECT COUNT(*) as total FROM reclamos"),
      
      // Promedio de calificaciones
      pool.query("SELECT AVG(calificacion) as promedio FROM reclamos"),
      
      // Distribución por calificación
      pool.query(`
        SELECT 
          calificacion,
          COUNT(*) as cantidad
        FROM reclamos 
        GROUP BY calificacion 
        ORDER BY calificacion
      `),
      
      // Reclamos del último mes
      pool.query(`
        SELECT COUNT(*) as total 
        FROM reclamos 
        WHERE fecha >= NOW() - INTERVAL '30 days'
      `),
      
      // Reclamos por día (últimos 7 días)
      pool.query(`
        SELECT 
          DATE(fecha) as dia,
          COUNT(*) as cantidad
        FROM reclamos 
        WHERE fecha >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(fecha)
        ORDER BY dia DESC
      `)
    ]);

    const [totalResult, promedioResult, distribucionResult, ultimoMesResult, ultimaSemanResult] = queries;

    const estadisticas = {
      total: parseInt(totalResult.rows[0].total),
      promedio: parseFloat(promedioResult.rows[0].promedio || 0).toFixed(1),
      ultimoMes: parseInt(ultimoMesResult.rows[0].total),
      distribucion: distribucionResult.rows,
      ultimaSemana: ultimaSemanResult.rows
    };

    res.json({
      success: true,
      data: estadisticas
    });

  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

// GET - Obtener reclamos por usuario
const getReclamosByUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const query = `
      SELECT 
        r.id,
        r.mensaje,
        r.calificacion,
        r.fecha
      FROM reclamos r
      WHERE r.usuario_id = $1
      ORDER BY r.fecha DESC
    `;
    
    const result = await pool.query(query, [usuario_id]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Error al obtener reclamos del usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

module.exports = {
  getReclamos,
  getReclamoById,
  createReclamo,
  updateReclamo,
  deleteReclamo,
  getEstadisticasReclamos,
  getReclamosByUsuario
};