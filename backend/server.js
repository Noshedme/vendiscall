const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

// Ruta raíz para mostrar que el servidor está funcionando
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Backend de VendisCall funcionando correctamente",
    status: "online",
    version: "1.0.0",
    endpoints: {
      register: "POST /api/register",
      login: "POST /api/login",
      productos: "GET /api/productos",
      usuarios: "GET /api/usuarios"
    }
  });
});

// Rutas de autenticación
const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);

// Importa el router de productos
const productosRoutes = require("./routes/productosRoutes");
app.use("/api/productos", productosRoutes);

// Importa el router de usuarios
const usuariosRoutes = require("./routes/usuariosRoutes");
app.use("/api/usuarios", usuariosRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});