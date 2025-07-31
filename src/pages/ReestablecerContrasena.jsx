import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { FaLockOpen, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export const ReestablecerContrasena = () => {
  const [email, setEmail] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const navigate = useNavigate();

  const handleReestablecer = async () => {
    if (!email || !nueva || !confirmar) {
      toast.error("Completa todos los campos");
      return;
    }

    if (nueva !== confirmar) {
      toast.warning("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/reestablecer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nueva }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Contraseña actualizada");
        setTimeout(() => navigate("/"), 2500);
      } else {
        toast.error(data.error || "Error al actualizar");
      }
    } catch (error) {
      toast.error("Error en el servidor");
    }
  };

  return (
    <motion.div
      className="container mt-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <ToastContainer />
      <motion.div
        className="card p-4 shadow mx-auto"
        style={{ maxWidth: 500 }}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-center text-success mb-4">
          <FaLockOpen className="me-2" />
          Reestablecer Contraseña
        </h3>

        <label className="form-label fw-bold">Correo registrado:</label>
        <input
          type="email"
          className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu email"
        />

        <label className="form-label fw-bold">Nueva contraseña:</label>
        <input
          type="password"
          className="form-control mb-3"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
          placeholder="Nueva contraseña"
        />

        <label className="form-label fw-bold">Confirmar contraseña:</label>
        <input
          type="password"
          className="form-control mb-4"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          placeholder="Confirma la nueva contraseña"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="btn btn-success w-100"
          onClick={handleReestablecer}
        >
          Actualizar contraseña <FaCheckCircle className="ms-2" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
