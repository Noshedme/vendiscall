//authRoutes.js en routes backend
const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

// Registro de cliente
router.post("/register", async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      usuario,
      cedula,
      celular,
      contrasena,
      fecha_nacimiento,
      edificio,
      departamento,
    } = req.body;

    const userExist = await pool.query(
      "SELECT * FROM usuarios WHERE cedula = $1 OR email = $2",
      [cedula, usuario]
    );

    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: "Cédula o usuario ya registrados" });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const nuevo = await pool.query(
      `INSERT INTO usuarios (
        email, cedula, rol_id, nombres, apellidos, celular,
        contrasena, fecha_nacimiento, edificio, departamento
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id, email, rol_id, nombres, apellidos`,
      [
        usuario,
        cedula,
        3,
        nombres,
        apellidos,
        celular,
        hashedPassword,
        fecha_nacimiento,
        edificio,
        departamento,
      ]
    );

    res.status(201).json({ 
      message: "Registrado correctamente", 
      user: nuevo.rows[0] 
    });
  } catch (err) {
    console.error("Error al registrar:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// Login de usuario
router.post("/login", async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    const result = await pool.query(
      "SELECT id, email, rol_id, nombres, apellidos, celular, contrasena FROM usuarios WHERE email = $1", 
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(contrasena, user.contrasena);

    if (!validPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    delete user.contrasena;
    res.json(user);
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Recuperar contraseña (simulado)
router.post("/recuperar", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Correo no registrado" });
    }

    console.log("🔐 Enlace de recuperación enviado a:", email);

    res.json({
      message: `Hemos enviado un enlace de recuperación al correo: ${email} (simulado en consola)`
    });
  } catch (error) {
    console.error("Error en recuperación:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Reestablecer contraseña
router.post("/reestablecer", async (req, res) => {
  const { email, nueva } = req.body;

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Correo no encontrado" });
    }

    const hashedPassword = await bcrypt.hash(nueva, 10);

    await pool.query(
      "UPDATE usuarios SET contrasena = $1 WHERE email = $2",
      [hashedPassword, email]
    );

    console.log("🔐 Contraseña actualizada para:", email);
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar contraseña:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// ⚠️ ¡IMPORTANTE! Exporta al final
module.exports = router;
