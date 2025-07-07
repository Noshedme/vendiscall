import React from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { BsStarFill } from "react-icons/bs";

const comentarios = [
  { id: 1, nombre: "Juan Pérez", comentario: "Muy buen servicio y atención.", calificacion: 5 },
  { id: 2, nombre: "María González", comentario: "El producto llegó tarde.", calificacion: 2 },
  { id: 3, nombre: "Carlos Ruiz", comentario: "La atención fue aceptable.", calificacion: 3 },
  { id: 4, nombre: "Ana Torres", comentario: "No me respondieron el reclamo.", calificacion: 1 },
  { id: 5, nombre: "Lucía Mendoza", comentario: "Todo excelente.", calificacion: 5 },
];

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

const data = [
  { name: "Excelente", value: comentarios.filter(c => c.calificacion === 5).length, color: "#28a745" },
  { name: "Bueno", value: comentarios.filter(c => c.calificacion === 4).length, color: "#17a2b8" },
  { name: "Regular", value: comentarios.filter(c => c.calificacion === 3).length, color: "#007bff" },
  { name: "Mala", value: comentarios.filter(c => c.calificacion === 2).length, color: "#ffc107" },
  { name: "Muy Mala", value: comentarios.filter(c => c.calificacion === 1).length, color: "#dc3545" },
].filter(item => item.value > 0); // Solo mostrar datos que existen

// Datos para el gráfico de barras
const barData = [
  { name: "5★", value: comentarios.filter(c => c.calificacion === 5).length },
  { name: "4★", value: comentarios.filter(c => c.calificacion === 4).length },
  { name: "3★", value: comentarios.filter(c => c.calificacion === 3).length },
  { name: "2★", value: comentarios.filter(c => c.calificacion === 2).length },
  { name: "1★", value: comentarios.filter(c => c.calificacion === 1).length },
];

export function Reportes() {
  const promedio = comentarios.reduce((acc, c) => acc + c.calificacion, 0) / comentarios.length;
  const totalComentarios = comentarios.length;
  
  // Estadísticas rápidas
  const excelentes = comentarios.filter(c => c.calificacion === 5).length;
  const malas = comentarios.filter(c => c.calificacion <= 2).length;
  const satisfaccion = ((excelentes + comentarios.filter(c => c.calificacion === 4).length) / totalComentarios * 100).toFixed(1);

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
                  <button type="button" className="btn btn-sm btn-outline-secondary">
                    <i className="bi bi-download"></i> Exportar
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
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
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
                      Comentarios Recientes ({comentarios.length})
                    </h6>
                    <div className="dropdown no-arrow">
                      <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown">
                        <i className="bi bi-three-dots-vertical text-gray-400"></i>
                      </a>
                      <div className="dropdown-menu dropdown-menu-right shadow">
                        <div className="dropdown-header">Acciones:</div>
                        <a className="dropdown-item" href="#">Ver todos</a>
                        <a className="dropdown-item" href="#">Filtrar</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#">Exportar</a>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Usuario</th>
                            <th>Comentario</th>
                            <th>Calificación</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {comentarios.map((c) => (
                            <tr key={c.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar me-3">
                                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{width: "35px", height: "35px"}}>
                                      {c.nombre.charAt(0)}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="font-weight-bold">{c.nombre}</div>
                                    <div className="text-muted small">Cliente</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="text-truncate" style={{maxWidth: "200px"}} title={c.comentario}>
                                  {c.comentario}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="me-2">
                                    {[...Array(c.calificacion)].map((_, i) => (
                                      <BsStarFill key={i} className="text-warning" style={{fontSize: "0.8rem"}} />
                                    ))}
                                    {[...Array(5-c.calificacion)].map((_, i) => (
                                      <BsStarFill key={i} className="text-muted" style={{fontSize: "0.8rem", opacity: "0.3"}} />
                                    ))}
                                  </div>
                                  <small className="text-muted">({c.calificacion}/5)</small>
                                </div>
                              </td>
                              <td>
                                <span className={`badge ${c.calificacion >= 4 ? 'bg-success' : c.calificacion >= 3 ? 'bg-info' : c.calificacion >= 2 ? 'bg-warning' : 'bg-danger'}`}>
                                  {etiquetas[c.calificacion]}
                                </span>
                              </td>
                              <td>
                                <div className="btn-group" role="group">
                                  <button type="button" className="btn btn-sm btn-outline-primary" title="Ver detalles">
                                    <i className="bi bi-eye"></i>
                                  </button>
                                  <button type="button" className="btn btn-sm btn-outline-success" title="Responder">
                                    <i className="bi bi-reply"></i>
                                  </button>
                                  <button type="button" className="btn btn-sm btn-outline-danger" title="Eliminar">
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}