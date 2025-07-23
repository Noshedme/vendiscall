// backend/routes/authRoutes.js
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

    // Verificar si ya existe el usuario
    const userExist = await pool.query(
      "SELECT * FROM usuarios WHERE cedula = $1 OR email = $2",
      [cedula, usuario]
    );

    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: "Cédula o usuario ya registrados" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar nuevo usuario
    const nuevo = await pool.query(
      `INSERT INTO usuarios (
        email, cedula, rol_id, nombres, apellidos, celular,
        contrasena, fecha_nacimiento, edificio, departamento
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        usuario,
        cedula,
        3, // rol_id 3 para cliente
        nombres,
        apellidos,
        celular,
        hashedPassword,
        fecha_nacimiento,
        edificio,
        departamento,
      ]
    );

    // No retornar la contraseña
    const { contrasena: _, ...userWithoutPassword } = nuevo.rows[0];

    res.status(201).json({ 
      message: "Registrado correctamente", 
      user: userWithoutPassword 
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

    // Buscar usuario por email
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1", 
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const validPassword = await bcrypt.compare(contrasena, user.contrasena);

    if (!validPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Remover contraseña del objeto usuario
    const { contrasena: _, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;