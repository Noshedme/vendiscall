//Reportes.jsx actualizado en pages en src
import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { BsStarFill } from "react-icons/bs";

const colores = {
  5: "#28a745", // Excelente
  4: "#17a2b8", // Bueno
  3: "#007bff", // Regular
  2: "#ffc107", // Mala
  1: "#dc3545", // Muy mala
};

const etiquetas = {
  5: "Excelente",
  4: "Bueno",
  3: "Regular",
  2: "Mala",
  1: "Muy Mala",
};

export function Reportes() {
  const [reclamos, setReclamos] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reclamoSeleccionado, setReclamoSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar reclamos y estadísticas en paralelo
      const [reclamosResponse, estadisticasResponse] = await Promise.all([
        fetch("http://localhost:3001/api/reclamos"),
        fetch("http://localhost:3001/api/reclamos/estadisticas")
      ]);

      const reclamosData = await reclamosResponse.json();
      const estadisticasData = await estadisticasResponse.json();

      if (reclamosData.success) {
        setReclamos(reclamosData.data);
      } else {
        setError("Error al cargar reclamos");
      }

      if (estadisticasData.success) {
        setEstadisticas(estadisticasData.data);
      } else {
        setError("Error al cargar estadísticas");
      }

    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const eliminarReclamo = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este reclamo?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/reclamos/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (data.success) {
        // Recargar datos después de eliminar
        cargarDatos();
        alert("Reclamo eliminado exitosamente");
      } else {
        alert("Error al eliminar reclamo: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    }
  };

  const verDetalles = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/reclamos/${id}`);
      const data = await response.json();

      if (data.success) {
        setReclamoSeleccionado(data.data);
        setShowModal(true);
      } else {
        alert("Error al cargar detalles del reclamo");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <div className="container-fluid flex-grow-1">
          <div className="row">
            <Sidebar />
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-3">
              <div className="d-flex justify-content-center align-items-center" style={{height: "60vh"}}>
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status" style={{width: "3rem", height: "3rem"}}>
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-3">Cargando reportes...</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <div className="container-fluid flex-grow-1">
          <div className="row">
            <Sidebar />
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-3">
              <div className="alert alert-danger text-center">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
                <br />
                <button className="btn btn-outline-danger mt-2" onClick={cargarDatos}>
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Reintentar
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  // Calcular datos para gráficos
  const promedio = reclamos.length > 0 ? reclamos.reduce((acc, c) => acc + c.calificacion, 0) / reclamos.length : 0;
  const totalComentarios = reclamos.length;
  
  // Estadísticas rápidas
  const excelentes = reclamos.filter(c => c.calificacion === 5).length;
  const malas = reclamos.filter(c => c.calificacion <= 2).length;
  const satisfaccion = totalComentarios > 0 ? ((excelentes + reclamos.filter(c => c.calificacion === 4).length) / totalComentarios * 100).toFixed(1) : 0;

  // Datos para gráfico de pie
  const data = [
    { name: "Excelente", value: reclamos.filter(c => c.calificacion === 5).length, color: "#28a745" },
    { name: "Bueno", value: reclamos.filter(c => c.calificacion === 4).length, color: "#17a2b8" },
    { name: "Regular", value: reclamos.filter(c => c.calificacion === 3).length, color: "#007bff" },
    { name: "Mala", value: reclamos.filter(c => c.calificacion === 2).length, color: "#ffc107" },
    { name: "Muy Mala", value: reclamos.filter(c => c.calificacion === 1).length, color: "#dc3545" },
  ].filter(item => item.value > 0);

  // Datos para el gráfico de barras
  const barData = [
    { name: "5★", value: reclamos.filter(c => c.calificacion === 5).length },
    { name: "4★", value: reclamos.filter(c => c.calificacion === 4).length },
    { name: "3★", value: reclamos.filter(c => c.calificacion === 3).length },
    { name: "2★", value: reclamos.filter(c => c.calificacion === 2).length },
    { name: "1★", value: reclamos.filter(c => c.calificacion === 1).length },
  ];

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container-fluid flex-grow-1">
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-3">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h2 className="text-danger fw-bold mb-0">
                <i className="bi bi-chat-dots me-2"></i>
                Reportes de Usuarios
              </h2>
              <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group me-2">
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={cargarDatos}
                  >
                    <i className="bi bi-arrow-clockwise"></i> Actualizar
                  </button>
                </div>
              </div>
            </div>

            {/* TARJETAS DE ESTADÍSTICAS RÁPIDAS */}
            <div className="row mb-4">
              <div className="col-xl-3 col-md-6 mb-3">
                <div className="card border-left-primary shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          Total Comentarios
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">{totalComentarios}</div>
                      </div>
                      <div className="col-auto">
                        <i className="bi bi-chat-dots fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6 mb-3">
                <div className="card border-left-success shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                          Promedio
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {promedio.toFixed(1)} <small className="text-warning">★</small>
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className="bi bi-star-fill fa-2x text-warning"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6 mb-3">
                <div className="card border-left-info shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                          Satisfacción
                        </div>
                        <div className="row no-gutters align-items-center">
                          <div className="col-auto">
                            <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{satisfaccion}%</div>
                          </div>
                          <div className="col">
                            <div className="progress progress-sm mr-2">
                              <div className="progress-bar bg-info" role="progressbar" style={{width: `${satisfaccion}%`}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className="bi bi-clipboard-data fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6 mb-3">
                <div className="card border-left-warning shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                          Problemas
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">{malas}</div>
                      </div>
                      <div className="col-auto">
                        <i className="bi bi-exclamation-triangle fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GRÁFICOS */}
            <div className="row mb-4">
              {/* Gráfico de Pie */}
              <div className="col-xl-6 col-lg-7 mb-3">
                <div className="card shadow">
                  <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">Distribución de Calificaciones</h6>
                  </div>
                  <div className="card-body">
                    {data.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({name, value}) => `${name}: ${value}`}
                          >
                            {data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center text-muted py-5">
                        <i className="bi bi-pie-chart fs-1"></i>
                        <p className="mt-2">No hay datos para mostrar</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Gráfico de Barras */}
              <div className="col-xl-6 col-lg-5 mb-3">
                <div className="card shadow">
                  <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">Calificaciones por Estrellas</h6>
                  </div>
                  <div className="card-body">
                    {totalComentarios > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center text-muted py-5">
                        <i className="bi bi-bar-chart fs-1"></i>
                        <p className="mt-2">No hay datos para mostrar</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* COMENTARIOS RECIENTES */}
            <div className="row">
              <div className="col-12">
                <div className="card shadow mb-4">
                  <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">
                      Comentarios Recientes ({reclamos.length})
                    </h6>
                    <div className="dropdown no-arrow">
                      <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown">
                        <i className="bi bi-three-dots-vertical text-gray-400"></i>
                      </a>
                      <div className="dropdown-menu dropdown-menu-right shadow">
                        <div className="dropdown-header">Acciones:</div>
                        <a className="dropdown-item" href="#" onClick={cargarDatos}>
                          <i className="bi bi-arrow-clockwise me-2"></i>Actualizar
                        </a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#">
                          <i className="bi bi-download me-2"></i>Exportar
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    {reclamos.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Usuario</th>
                              <th>Comentario</th>
                              <th>Calificación</th>
                              <th>Fecha</th>
                              <th>Estado</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reclamos.slice(0, 10).map((reclamo) => (
                              <tr key={reclamo.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="avatar me-3">
                                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{width: "35px", height: "35px"}}>
                                        {reclamo.nombre.charAt(0)}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="font-weight-bold">{reclamo.nombre}</div>
                                      <div className="text-muted small">{reclamo.email}</div>
                                      <div className="text-muted small">
                                        {reclamo.edificio && reclamo.departamento && 
                                          `${reclamo.edificio} - Depto ${reclamo.departamento}`
                                        }
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="text-truncate" style={{maxWidth: "250px"}} title={reclamo.comentario}>
                                    {reclamo.comentario}
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="me-2">
                                      {[...Array(reclamo.calificacion)].map((_, i) => (
                                        <BsStarFill key={i} className="text-warning" style={{fontSize: "0.8rem"}} />
                                      ))}
                                      {[...Array(5-reclamo.calificacion)].map((_, i) => (
                                        <BsStarFill key={i} className="text-muted" style={{fontSize: "0.8rem", opacity: "0.3"}} />
                                      ))}
                                    </div>
                                    <small className="text-muted">({reclamo.calificacion}/5)</small>
                                  </div>
                                </td>
                                <td>
                                  <small className="text-muted">
                                    {formatearFecha(reclamo.fecha)}
                                  </small>
                                </td>
                                <td>
                                  <span className={`badge ${reclamo.calificacion >= 4 ? 'bg-success' : reclamo.calificacion >= 3 ? 'bg-info' : reclamo.calificacion >= 2 ? 'bg-warning' : 'bg-danger'}`}>
                                    {etiquetas[reclamo.calificacion]}
                                  </span>
                                </td>
                                <td>
                                  <div className="btn-group" role="group">
                                    <button 
                                      type="button" 
                                      className="btn btn-sm btn-outline-primary" 
                                      title="Ver detalles"
                                      onClick={() => verDetalles(reclamo.id)}
                                    >
                                      <i className="bi bi-eye"></i>
                                    </button>
                                    <button type="button" className="btn btn-sm btn-outline-success" title="Responder">
                                      <i className="bi bi-reply"></i>
                                    </button>
                                    <button 
                                      type="button" 
                                      className="btn btn-sm btn-outline-danger" 
                                      title="Eliminar"
                                      onClick={() => eliminarReclamo(reclamo.id)}
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center text-muted py-5">
                        <i className="bi bi-chat-dots fs-1"></i>
                        <p className="mt-2">No hay reclamos registrados</p>
                        <p className="small">Los reclamos aparecerán aquí cuando los usuarios los envíen</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal para ver detalles del reclamo */}
            {showModal && reclamoSeleccionado && (
              <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">
                        <i className="bi bi-chat-dots me-2"></i>
                        Detalles del Reclamo #{reclamoSeleccionado.id}
                      </h5>
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setShowModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-md-6">
                          <h6 className="text-primary">Información del Usuario</h6>
                          <p><strong>Nombre:</strong> {reclamoSeleccionado.usuario.nombres} {reclamoSeleccionado.usuario.apellidos}</p>
                          <p><strong>Email:</strong> {reclamoSeleccionado.usuario.email}</p>
                          <p><strong>Cédula:</strong> {reclamoSeleccionado.usuario.cedula}</p>
                          <p><strong>Teléfono:</strong> {reclamoSeleccionado.usuario.celular}</p>
                          {reclamoSeleccionado.usuario.edificio && (
                            <p><strong>Ubicación:</strong> {reclamoSeleccionado.usuario.edificio} - Depto {reclamoSeleccionado.usuario.departamento}</p>
                          )}
                        </div>
                        <div className="col-md-6">
                          <h6 className="text-primary">Información del Reclamo</h6>
                          <p><strong>Fecha:</strong> {formatearFecha(reclamoSeleccionado.fecha)}</p>
                          <p><strong>Calificación:</strong> 
                            <span className="ms-2">
                              {[...Array(reclamoSeleccionado.calificacion)].map((_, i) => (
                                <BsStarFill key={i} className="text-warning me-1" />
                              ))}
                              <span className="ms-1">({reclamoSeleccionado.calificacion}/5 - {etiquetas[reclamoSeleccionado.calificacion]})</span>
                            </span>
                          </p>
                          <div>
                            <strong>Mensaje:</strong>
                            <div className="border p-3 mt-2 rounded bg-light">
                              {reclamoSeleccionado.mensaje}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-outline-success">
                        <i className="bi bi-reply me-1"></i>
                        Responder
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-danger"
                        onClick={() => {
                          setShowModal(false);
                          eliminarReclamo(reclamoSeleccionado.id);
                        }}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Eliminar
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setShowModal(false)}
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}