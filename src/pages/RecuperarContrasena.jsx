import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { FaEnvelopeOpenText, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export const RecuperarContrasena = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleRecuperar = async () => {
    if (!email) {
      toast.error("Ingresa tu correo para continuar");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/recuperar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setTimeout(() => navigate("/reestablecer"), 2500); // Redirige luego del toast
      } else {
        toast.error(data.error || "Error al recuperar");
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
        <h3 className="text-center text-danger mb-4">
          <FaEnvelopeOpenText className="me-2" />
          Recuperar Contraseña
        </h3>

        <label className="form-label fw-bold">Correo electrónico:</label>
        <input
          type="email"
          className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu correo registrado"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="btn btn-danger w-100"
          onClick={handleRecuperar}
        >
          Enviar enlace de recuperación
        </motion.button>

        <div className="text-center mt-3">
          <a
            href="/reestablecer"
            className="text-decoration-none text-primary fw-bold"
          >
            Ya tengo el enlace <FaArrowRight className="ms-1" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};
