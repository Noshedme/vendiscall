import { pool } from "../db.js";
import bcrypt from "bcrypt";

// Registro
export const registerUser = async (req, res) => {
  try {
    const {
      email, cedula, rol_id, nombres,
      apellidos, celular, contrasena,
      fecha_nacimiento, edificio, departamento,
    } = req.body;

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const result = await pool.query(
      `INSERT INTO usuarios 
      (email, cedula, rol_id, nombres, apellidos, celular, contrasena, fecha_nacimiento, edificio, departamento)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id, email, rol_id, nombres, apellidos`,
      [
        email, cedula, rol_id, nombres,
        apellidos, celular, hashedPassword,
        fecha_nacimiento, edificio, departamento
      ]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    const result = await pool.query("SELECT id, email, rol_id, nombres, apellidos, celular, contrasena FROM usuarios WHERE email = $1", [email]);

    if (result.rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    const user = result.rows[0];
    const valid = await bcrypt.compare(contrasena, user.contrasena);

    if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

    delete user.contrasena;
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};
