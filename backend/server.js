// server.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
