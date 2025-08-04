import React, { useState } from "react";
import { Header } from "../components/Header";
import { toast, ToastContainer } from "react-toastify";
import { BsStarFill, BsStar } from "react-icons/bs";
import { motion } from "framer-motion";

import "react-toastify/dist/ReactToastify.css";

export function FormularioReclamos() {
  const [formData, setFormData] = useState({
    mensaje: "",
    calificacion: 0,
  });
  const [loading, setLoading] = useState(false);

  // Usuario logueado desde localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mensaje.trim()) {
      toast.error("Por favor ingresa tu mensaje");
      return;
    }
    if (formData.calificacion === 0) {
      toast.error("Por favor selecciona una calificación");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/reclamos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: user.id,
          mensaje: formData.mensaje.trim(),
          calificacion: formData.calificacion,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("¡Reclamo enviado exitosamente! Gracias por tu opinión.");
        setFormData({ mensaje: "", calificacion: 0 });
      } else {
        toast.error(data.message || "Error al enviar el reclamo");
      }
    } catch (error) {
      toast.error("Error de conexión. Intenta nuevamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (rating) => {
    setFormData({ ...formData, calificacion: rating });
  };

  const renderStars = () =>
    [...Array(5)].map((_, i) => {
      const val = i + 1;
      return (
        <button
          key={val}
          type="button"
          className="btn p-0 me-2"
          onClick={() => handleStarClick(val)}
          aria-label={`Calificación ${val} estrellas`}
          style={{ fontSize: "1.8rem" }}
        >
          {val <= formData.calificacion ? (
            <BsStarFill className="text-warning" />
          ) : (
            <BsStar className="text-muted" />
          )}
        </button>
      );
    });

  const calificacionText = {
    1: "Muy Mala",
    2: "Mala",
    3: "Regular",
    4: "Buena",
    5: "Excelente",
  };

  return (
    <>
      <Header />

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <motion.div
        className="container py-5"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-header bg-danger text-white text-center py-4 rounded-top">
                <h3 className="mb-0 fw-bold">
                  <i className="bi bi-chat-dots me-2"></i>Enviar Reclamo
                </h3>
                <small className="opacity-75">
                  Tu opinión nos ayuda a mejorar siempre
                </small>
              </div>

              <form onSubmit={handleSubmit} className="card-body p-4">
                {/* Usuario info */}
                <div className="mb-4 border rounded p-3 bg-light">
                  <h6 className="text-muted mb-2">Información del usuario</h6>
                  <p className="mb-1 fw-semibold">
                    {user.nombres} {user.apellidos}
                  </p>
                  <p className="mb-0 text-truncate" title={user.email}>
                    {user.email}
                  </p>
                </div>

                {/* Calificación */}
                <div className="mb-4">
                  <label className="form-label fw-semibold d-block mb-2">
                    <i className="bi bi-star-fill text-warning me-1"></i>
                    Calificación <span className="text-danger">*</span>
                  </label>
                  <div className="d-flex align-items-center mb-1">{renderStars()}</div>
                  {formData.calificacion > 0 && (
                    <small className="badge bg-warning text-dark px-3 py-1 rounded-pill">
                      {formData.calificacion}/5 - {calificacionText[formData.calificacion]}
                    </small>
                  )}
                  <div className="form-text mt-2">
                    Haz clic en las estrellas para calificar tu experiencia.
                  </div>
                </div>

                {/* Mensaje */}
                <div className="mb-4">
                  <label htmlFor="mensaje" className="form-label fw-semibold">
                    <i className="bi bi-chat-text me-1"></i>
                    Mensaje <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="mensaje"
                    rows="5"
                    className="form-control shadow-sm"
                    placeholder="Cuéntanos sobre tu experiencia, sugerencias o reclamos..."
                    value={formData.mensaje}
                    maxLength={1000}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    disabled={loading}
                  ></textarea>
                  <div className="form-text text-end">
                    {formData.mensaje.length} / 1000 caracteres
                  </div>
                </div>

                {/* Botones */}
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    disabled={loading}
                    onClick={() => setFormData({ mensaje: "", calificacion: 0 })}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i> Limpiar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-1"></i> Enviar Reclamo
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="card-footer bg-light rounded-bottom text-center">
                <small className="text-muted">
                  Todos los reclamos son revisados y respondidos en un máximo de 48
                  horas.
                </small>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
