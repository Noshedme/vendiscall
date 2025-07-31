// FormularioReclamos.jsx - Página para que los clientes generen reclamos
import React, { useState } from "react";
import { Header } from "../components/Header";
import { BsStarFill, BsStar } from "react-icons/bs";

export function FormularioReclamos() {
  const [formData, setFormData] = useState({
    mensaje: "",
    calificacion: 0
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  // Obtener usuario logueado del localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.mensaje.trim()) {
      setError("Por favor ingresa tu mensaje");
      return;
    }
    
    if (formData.calificacion === 0) {
      setError("Por favor selecciona una calificación");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/reclamos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: user.id,
          mensaje: formData.mensaje.trim(),
          calificacion: formData.calificacion
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccess(true);
        setFormData({ mensaje: "", calificacion: 0 });
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        setError(data.message || "Error al enviar el reclamo");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (rating) => {
    setFormData({ ...formData, calificacion: rating });
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <button
          key={index}
          type="button"
          className="btn p-0 me-1"
          onClick={() => handleStarClick(starValue)}
          style={{ fontSize: "1.5rem" }}
        >
          {starValue <= formData.calificacion ? (
            <BsStarFill className="text-warning" />
          ) : (
            <BsStar className="text-muted" />
          )}
        </button>
      );
    });
  };

  const getCalificacionTexto = () => {
    const textos = {
      1: "Muy Mala",
      2: "Mala", 
      3: "Regular",
      4: "Buena",
      5: "Excelente"
    };
    return textos[formData.calificacion] || "";
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container-fluid flex-grow-1 bg-light">
        <div className="row justify-content-center py-5">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow">
              <div className="card-header bg-primary text-white text-center py-4">
                <h3 className="mb-0">
                  <i className="bi bi-chat-dots me-2"></i>
                  Enviar Reclamo o Sugerencia
                </h3>
                <p className="mb-0 mt-2 opacity-75">
                  Tu opinión es muy importante para nosotros
                </p>
              </div>
              
              <div className="card-body p-4">
                {/* Mensaje de éxito */}
                {showSuccess && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="bi bi-check-circle me-2"></i>
                    <strong>¡Gracias!</strong> Tu reclamo ha sido enviado exitosamente. 
                    Lo revisaremos pronto.
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowSuccess(false)}
                    ></button>
                  </div>
                )}

                {/* Mensaje de error */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError("")}
                    ></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Información del usuario */}
                  <div className="mb-4 p-3 bg-light rounded">
                    <h6 className="text-muted mb-2">Información del usuario:</h6>
                    <p className="mb-1">
                      <strong>Nombre:</strong> {user.nombres} {user.apellidos}
                    </p>
                    <p className="mb-0">
                      <strong>Email:</strong> {user.email}
                    </p>
                  </div>

                  {/* Calificación */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      <i className="bi bi-star me-2"></i>
                      Calificación *
                    </label>
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        {renderStars()}
                      </div>
                      {formData.calificacion > 0 && (
                        <span className="badge bg-secondary">
                          {formData.calificacion}/5 - {getCalificacionTexto()}
                        </span>
                      )}
                    </div>
                    <div className="form-text">
                      Haz clic en las estrellas para calificar tu experiencia
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div className="mb-4">
                    <label htmlFor="mensaje" className="form-label fw-bold">
                      <i className="bi bi-chat-text me-2"></i>
                      Mensaje *
                    </label>
                    <textarea
                      id="mensaje"
                      className="form-control"
                      rows="6"
                      placeholder="Cuéntanos sobre tu experiencia, sugerencias o reclamos..."
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      maxLength="1000"
                    ></textarea>
                    <div className="form-text">
                      {formData.mensaje.length}/1000 caracteres
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setFormData({ mensaje: "", calificacion: 0 })}
                      disabled={loading}
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Limpiar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-1"></i>
                          Enviar Reclamo
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Información adicional */}
            <div className="card mt-4">
              <div className="card-body">
                <h6 className="card-title text-primary">
                  <i className="bi bi-info-circle me-2"></i>
                  Información importante
                </h6>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <i className="bi bi-check text-success me-2"></i>
                    Todos los reclamos son revisados por nuestro equipo
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check text-success me-2"></i>
                    Responderemos en un plazo máximo de 48 horas
                  </li>
                  <li className="mb-0">
                    <i className="bi bi-check text-success me-2"></i>
                    Tu información personal será tratada con confidencialidad
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}