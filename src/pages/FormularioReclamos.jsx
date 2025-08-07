import React, { useState } from "react";
import { Header } from "../components/Header";
import { toast, ToastContainer } from "react-toastify";
import { BsStarFill, BsStar } from "react-icons/bs";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export function FormularioReclamos() {
  const [formData, setFormData] = useState({
    mensaje: "",
    calificacion: 0,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [enviado, setEnviado] = useState(false);

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
        setEnviado(true);
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
        <motion.button
          key={val}
          type="button"
          className="btn p-0 me-2"
          onClick={() => handleStarClick(val)}
          aria-label={`Calificación ${val} estrellas`}
          style={{ fontSize: "1.8rem" }}
          whileHover={{ scale: 1.2, rotate: -10 + val * 4 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {val <= formData.calificacion ? (
            <BsStarFill className="text-warning" />
          ) : (
            <BsStar className="text-secondary" />
          )}
        </motion.button>
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

      {/* Fondo borroso con colores de la tienda */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          background: "#fffbe6",
          filter: "blur(3px) brightness(0.97)",
          opacity: 0.7,
        }}
      />

      <motion.div
        className="container py-5"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ position: "relative", zIndex: 1 }}
      >
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <motion.div
              className="card glassmorphism shadow-lg border-0 rounded-4"
              initial={{ scale: 0.97, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                backdropFilter: "blur(10px)",
                background: "rgba(255,255,255,0.85)",
                border: "2px solid #e6394633",
                boxShadow: "0 0 24px #ffe06655, 0 2px 8px #e6394622",
              }}
            >
              <motion.div
                className="card-header text-danger text-center py-4 rounded-top"
                style={{
                  background: "#fff",
                  borderBottom: "2px solid #e6394633",
                  boxShadow: "0 2px 12px #ffe06633",
                }}
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  style={{ display: "inline-block" }}
                >
                  <i className="bi bi-chat-dots-fill me-2" style={{ fontSize: "2rem", color: "#e63946" }}></i>
                </motion.div>
                <h3 className="mb-0 fw-bold" style={{ color: "#e63946" }}>
                  Enviar Reclamo
                </h3>
                <small className="opacity-75 text-dark">
                  Tu opinión nos ayuda a mejorar siempre
                </small>
              </motion.div>

              {!enviado ? (
                <form onSubmit={handleSubmit} className="card-body p-4">
                  {/* Usuario info */}
                  <motion.div
                    className="mb-4 border rounded-3 p-3 bg-light bg-opacity-75 glassmorphism"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                      borderLeft: "4px solid #e63946",
                      boxShadow: "0 2px 8px #ffe06622",
                    }}
                  >
                    <h6 className="text-muted mb-2">Información del usuario</h6>
                    <p className="mb-1 fw-semibold text-danger">
                      {user.nombres} {user.apellidos}
                    </p>
                    <p className="mb-0 text-truncate" title={user.email}>
                      {user.email}
                    </p>
                  </motion.div>

                  {/* Calificación */}
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label className="form-label fw-semibold d-block mb-2 text-danger">
                      <i className="bi bi-star-fill text-warning me-1"></i>
                      Calificación <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex align-items-center mb-1">
                      {renderStars()}
                    </div>
                    {formData.calificacion > 0 && (
                      <small className="badge bg-warning text-dark px-3 py-1 rounded-pill shadow-sm">
                        {formData.calificacion}/5 - {calificacionText[formData.calificacion]}
                      </small>
                    )}
                    <div className="form-text mt-2 text-dark">
                      Haz clic en las estrellas para calificar tu experiencia.
                    </div>
                  </motion.div>

                  {/* Mensaje */}
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label
                      htmlFor="mensaje"
                      className="form-label fw-semibold text-danger"
                    >
                      <i className="bi bi-chat-text me-1"></i>
                      Mensaje <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="mensaje"
                      rows="5"
                      className="form-control shadow-sm"
                      style={{
                        background: "rgba(255,255,255,0.95)",
                        border: "1.5px solid #ffe06699",
                        borderRadius: "10px",
                        fontSize: "1.05rem",
                        resize: "vertical",
                      }}
                      placeholder="Cuéntanos sobre tu experiencia, sugerencias o reclamos..."
                      value={formData.mensaje}
                      maxLength={1000}
                      onChange={(e) =>
                        setFormData({ ...formData, mensaje: e.target.value })
                      }
                      disabled={loading}
                    ></textarea>
                    <div className="form-text text-end text-dark">
                      {formData.mensaje.length} / 1000 caracteres
                    </div>
                  </motion.div>

                  {/* Botones */}
                  <div className="d-flex justify-content-end gap-2 mt-2">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      disabled={loading}
                      onClick={() => setFormData({ mensaje: "", calificacion: 0 })}
                      style={{
                        borderWidth: 2,
                        borderColor: "#e63946",
                        color: "#e63946",
                        boxShadow: "0 0 8px #e6394622",
                      }}
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i> Limpiar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-warning text-dark fw-bold"
                      disabled={loading}
                      style={{
                        borderWidth: 2,
                        borderColor: "#ffe066",
                        boxShadow: "0 0 12px #ffe06655",
                      }}
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
              ) : (
                <motion.div
                  className="card-body p-4 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="mb-3">
                    <i className="bi bi-emoji-smile text-warning" style={{ fontSize: "3rem" }}></i>
                  </div>
                  <h4 className="text-success mb-3">¡Gracias por tu reclamo!</h4>
                  <p className="mb-4 text-dark">
                    Tu mensaje ha sido enviado correctamente.<br />
                    Nos pondremos en contacto contigo si es necesario.
                  </p>
                  <button
                    className="btn btn-danger"
                    onClick={() => navigate("/cliente")}
                  >
                    Volver al inicio
                  </button>
                </motion.div>
              )}

              <div
                className="card-footer bg-light bg-opacity-75 rounded-bottom text-center"
                style={{
                  borderTop: "1.5px solid #ffe06655",
                  fontSize: "0.95rem",
                  color: "#e63946",
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                }}
              >
                <small>
                  Todos los reclamos son revisados y respondidos en un máximo de 48 horas.
                </small>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Estilos personalizados para efecto glass y colores de la tienda */}
      <style>{`
        .glassmorphism {
          background: rgba(255,255,255,0.85) !important;
          backdrop-filter: blur(10px);
        }
        .btn-warning {
          background: linear-gradient(90deg, #ffe066 0%, #fff 100%) !important;
          border: none !important;
        }
        .btn-outline-danger {
          border-color: #e63946 !important;
          color: #e63946 !important;
        }
        .btn-outline-danger:hover, .btn-warning:hover {
          filter: brightness(1.07) drop-shadow(0 0 6px #ffe06655);
        }
        .card {
          border-radius: 1.5rem !important;
        }
        .card-header, .card-footer {
          border-radius: 1.5rem 1.5rem 0 0 !important;
        }
        textarea:focus, input:focus {
          border-color: #ffe066 !important;
          box-shadow: 0 0 0 0.2rem #ffe06633 !important;
        }
      `}</style>
    </>
  );
}
