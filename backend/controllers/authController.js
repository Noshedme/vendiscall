// controllers/authController.js

const pool = require("../db");
const bcrypt = require("bcrypt");

// Registro de cliente
const registerCliente = async (req, res) => {
  const {
    nombres,
    apellidos,
    cedula,
    celular,
    contrasena,
    fecha_nacimiento,
    edificio,
    departamento,
  } = req.body;

  try {
    // Validar si ya existe usuario con la misma cédula
    const userExists = await pool.query(
      "SELECT * FROM usuarios WHERE cedula = $1",
      [cedula]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "La cédula ya está registrada" });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar nuevo cliente
    const result = await pool.query(
      `INSERT INTO usuarios 
        (nombres, apellidos, cedula, celular, contrasena, fecha_nacimiento, edificio, departamento, rol_id) 
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING id, nombres, apellidos, cedula, celular, fecha_nacimiento, edificio, departamento, rol_id`,
      [
        nombres,
        apellidos,
        cedula,
        celular,
        hashedPassword,
        fecha_nacimiento,
        edificio,
        departamento,
        3, // rol_id = 3 para cliente
      ]
    );

    res.status(201).json({ message: "Cliente registrado exitosamente", usuario: result.rows[0] });
  } catch (error) {
    console.error("Error al registrar cliente:", error);
    res.status(500).json({ message: "Error al registrar cliente" });
  }
};

// Login de usuario
const login = async (req, res) => {
  const { cedula, contrasena } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE cedula = $1",
      [cedula]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const usuario = result.rows[0];

    const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Puedes agregar generación de token JWT aquí si lo deseas
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      usuario: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        cedula: usuario.cedula,
        celular: usuario.celular,
        fecha_nacimiento: usuario.fecha_nacimiento,
        edificio: usuario.edificio,
        departamento: usuario.departamento,
        rol_id: usuario.rol_id,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

module.exports = {
  registerCliente,
  login,
};
