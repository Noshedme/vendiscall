// backend/db.js
// Conexión a PostgreSQL usando Pool. Exporta query, pool y getClient.
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || process.env.PGUSER,
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : (process.env.PGPORT ? parseInt(process.env.PGPORT,10) : 5432),
  database: process.env.DB_DATABASE || process.env.PGDATABASE || "vendiscall",
  // Puedes agregar opciones: max, idleTimeoutMillis, connectionTimeoutMillis
});

pool.on("connect", () => {
  console.log("✅ Conectado a PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Error en PostgreSQL:", err);
});

// Función para ejecutar queries simples
const query = (text, params) => {
  return pool.query(text, params);
};

// Obtener un cliente para transacciones (client.connect / client.release)
const getClient = async () => {
  return await pool.connect();
};

module.exports = {
  query,
  pool,
  getClient,
};
