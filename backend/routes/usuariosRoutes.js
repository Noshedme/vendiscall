const express = require("express");
const router = express.Router();
const db = require("../db"); // ✅ correcto
 // Asumiendo que tienes tu conexión a DB aquí
const bcrypt = require("bcrypt");

// GET - Obtener todos los usuarios con información de rol
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id,
        u.email,
        u.cedula,
        u.nombres,
        u.apellidos,
        u.celular,
        u.fecha_nacimiento,
        u.edificio,
        u.departamento,
        r.nombre as rol
      FROM usuarios u
      INNER JOIN roles r ON u.rol_id = r.id
      ORDER BY u.id ASC
    `;
    
    const result = await db.query(query);
    
    // Formatear los datos para el frontend
    const usuarios = result.rows.map(usuario => ({
      id: usuario.id,
      nombre: usuario.nombres,
      apellido: usuario.apellidos,
      email: usuario.email,
      cedula: usuario.cedula,
      rol: usuario.rol.toLowerCase(),
      estado: "activo", // Por ahora todos activos, puedes agregar este campo a la DB después
      telefono: usuario.celular,
      fechaRegistro: usuario.fecha_nacimiento, // O puedes agregar created_at a la tabla
      ultimoAcceso: new Date().toISOString().split('T')[0], // Placeholder, agregar campo después
      edificio: usuario.edificio,
      departamento: usuario.departamento
    }));
    
    res.json({
      success: true,
      data: usuarios
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// GET - Obtener usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        u.id,
        u.email,
        u.cedula,
        u.nombres,
        u.apellidos,
        u.celular,
        u.fecha_nacimiento,
        u.edificio,
        u.departamento,
        r.nombre as rol
      FROM usuarios u
      INNER JOIN roles r ON u.rol_id = r.id
      WHERE u.id = $1
    `;
    
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }
    
    const usuario = result.rows[0];
    res.json({
      success: true,
      data: {
        id: usuario.id,
        nombre: usuario.nombres,
        apellido: usuario.apellidos,
        email: usuario.email,
        cedula: usuario.cedula,
        rol: usuario.rol.toLowerCase(),
        telefono: usuario.celular,
        fechaNacimiento: usuario.fecha_nacimiento,
        edificio: usuario.edificio,
        departamento: usuario.departamento
      }
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// POST - Crear nuevo usuario
router.post("/", async (req, res) => {
  try {
    const {
      email,
      cedula,
      nombres,
      apellidos,
      celular,
      contrasena,
      fecha_nacimiento,
      edificio,
      departamento,
      rol_id
    } = req.body;

    // Validar que el email no exista
    const emailExists = await db.query("SELECT id FROM usuarios WHERE email = $1", [email]);
    if (emailExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "El email ya está registrado"
      });
    }

    // Validar que la cédula no exista
    const cedulaExists = await db.query("SELECT id FROM usuarios WHERE cedula = $1", [cedula]);
    if (cedulaExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "La cédula ya está registrada"
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar usuario
    const query = `
      INSERT INTO usuarios (email, cedula, rol_id, nombres, apellidos, celular, contrasena, fecha_nacimiento, edificio, departamento)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `;

    const result = await db.query(query, [
      email,
      cedula,
      rol_id,
      nombres,
      apellidos,
      celular,
      hashedPassword,
      fecha_nacimiento,
      edificio,
      departamento
    ]);

    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      data: { id: result.rows[0].id }
    });

  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// PUT - Actualizar usuario
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email,
      cedula,
      nombres,
      apellidos,
      celular,
      fecha_nacimiento,
      edificio,
      departamento,
      rol_id
    } = req.body;

    // Verificar que el usuario existe
    const userExists = await db.query("SELECT id FROM usuarios WHERE id = $1", [id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // Actualizar usuario
    const query = `
      UPDATE usuarios 
      SET email = $1, cedula = $2, nombres = $3, apellidos = $4, celular = $5, 
          fecha_nacimiento = $6, edificio = $7, departamento = $8, rol_id = $9
      WHERE id = $10
      RETURNING id
    `;

    await db.query(query, [
      email,
      cedula,
      nombres,
      apellidos,
      celular,
      fecha_nacimiento,
      edificio,
      departamento,
      rol_id,
      id
    ]);

    res.json({
      success: true,
      message: "Usuario actualizado exitosamente"
    });

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// DELETE - Eliminar usuario
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario existe
    const userExists = await db.query("SELECT id FROM usuarios WHERE id = $1", [id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // Eliminar usuario
    await db.query("DELETE FROM usuarios WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "Usuario eliminado exitosamente"
    });

  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// GET - Obtener todos los roles
router.get("/roles/all", async (req, res) => {
  try {
    const result = await db.query("SELECT id, nombre FROM roles ORDER BY id");
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Error al obtener roles:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

module.exports = router;