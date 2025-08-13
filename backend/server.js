// backend/server.js
// Servidor principal Express para VendisCall / VendisMarket
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Root - info básica del servidor
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Backend de VendisCall funcionando correctamente",
    status: "online",
    version: "1.0.0",
    endpoints: {
      register: "POST /api/register",
      login: "POST /api/login",
      productos: "GET /api/productos",
      usuarios: "GET /api/usuarios",
      reclamos: "GET /api/reclamos",
      ventas: "POST /api/ventas  | GET /api/ventas | GET /api/ventas/:id | PATCH /api/ventas/:id"
    }
  });
});

/*
  Monta routers existentes (ajusta las rutas si la estructura de carpetas es distinta).
  Asegúrate de que estos archivos existen en backend/routes/ y exportan un router.
*/
try {
  const authRoutes = require("./routes/authRoutes");
  app.use("/api", authRoutes);
} catch (err) {
  console.warn("⚠️  No se encontró ./routes/authRoutes (si no lo usas, ignora).");
}

try {
  const productosRoutes = require("./routes/productosRoutes");
  app.use("/api/productos", productosRoutes);
} catch (err) {
  console.warn("⚠️  No se encontró ./routes/productosRoutes.");
}

try {
  const usuariosRoutes = require("./routes/usuariosRoutes");
  app.use("/api/usuarios", usuariosRoutes);
} catch (err) {
  console.warn("⚠️  No se encontró ./routes/usuariosRoutes.");
}

try {
  const reclamosRoutes = require("./routes/reclamosRoutes");
  app.use("/api/reclamos", reclamosRoutes);
} catch (err) {
  console.warn("⚠️  No se encontró ./routes/reclamosRoutes.");
}

try {
  const carritoRouter = require("./routes/carrito");
  app.use("/api/carrito", carritoRouter);
} catch (err) {
  console.warn("⚠️  No se encontró ./routes/carrito.");
}

// Montar rutas de ventas (crea backend/routes/ventasRoutes.js con el contenido que definimos)
try {
  const ventasRoutes = require("./routes/ventasRoutes");
  app.use("/api/ventas", ventasRoutes);
} catch (err) {
  console.warn("⚠️  No se encontró ./routes/ventasRoutes. Crea backend/routes/ventasRoutes.js para habilitar ventas en BBDD.");
}

/*
  Middleware para manejar rutas no encontradas (404)
*/
app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint no encontrado" });
});

/*
  Middleware general para manejo de errores
*/
app.use((err, req, res, next) => {
  console.error("Error en servidor:", err);
  res.status(err.status || 500).json({ error: err.message || "Error interno del servidor" });
});

// Levantar servidor
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
