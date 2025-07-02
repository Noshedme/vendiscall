import React, { useState, useMemo } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

// Datos de usuarios quemados (temporal)
const usuariosData = [
  {
    id: 1,
    nombre: "Juan Carlos",
    apellido: "Pérez",
    email: "juan.perez@vendismarket.com",
    rol: "admin",
    estado: "activo",
    telefono: "0998765432",
    fechaRegistro: "2024-01-15",
    ultimoAcceso: "2024-07-01"
  },
  {
    id: 2,
    nombre: "María Elena",
    apellido: "González",
    email: "maria.gonzalez@vendismarket.com",
    rol: "cajero",
    estado: "activo",
    telefono: "0987654321",
    fechaRegistro: "2024-02-20",
    ultimoAcceso: "2024-06-30"
  },
  {
    id: 3,
    nombre: "Carlos Alberto",
    apellido: "Rodríguez",
    email: "carlos.rodriguez@gmail.com",
    rol: "cliente",
    estado: "activo",
    telefono: "0976543210",
    fechaRegistro: "2024-03-10",
    ultimoAcceso: "2024-07-02"
  },
  {
    id: 4,
    nombre: "Ana Patricia",
    apellido: "López",
    email: "ana.lopez@yahoo.com",
    rol: "cliente",
    estado: "inactivo",
    telefono: "0965432109",
    fechaRegistro: "2024-01-25",
    ultimoAcceso: "2024-05-15"
  },
  {
    id: 5,
    nombre: "Luis Fernando",
    apellido: "Martínez",
    email: "luis.martinez@vendismarket.com",
    rol: "cajero",
    estado: "activo",
    telefono: "0954321098",
    fechaRegistro: "2024-04-05",
    ultimoAcceso: "2024-07-01"
  },
  {
    id: 6,
    nombre: "Sandra Milena",
    apellido: "Torres",
    email: "sandra.torres@hotmail.com",
    rol: "cliente",
    estado: "activo",
    telefono: "0943210987",
    fechaRegistro: "2024-05-12",
    ultimoAcceso: "2024-07-02"
  },
  {
    id: 7,
    nombre: "Diego Armando",
    apellido: "Vargas",
    email: "diego.vargas@gmail.com",
    rol: "cliente",
    estado: "activo",
    telefono: "0932109876",
    fechaRegistro: "2024-06-01",
    ultimoAcceso: "2024-07-01"
  },
  {
    id: 8,
    nombre: "Gabriela Esperanza",
    apellido: "Morales",
    email: "gabriela.morales@vendismarket.com",
    rol: "admin",
    estado: "activo",
    telefono: "0921098765",
    fechaRegistro: "2024-01-10",
    ultimoAcceso: "2024-07-02"
  }
];

export const Usuarios = () => {
  const [usuarios] = useState(usuariosData);
  const [filtroRol, setFiltroRol] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // Filtrar usuarios
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(usuario => {
      const cumpleFiltroRol = filtroRol === "todos" || usuario.rol === filtroRol;
      const cumpleFiltroEstado = filtroEstado === "todos" || usuario.estado === filtroEstado;
      const cumpleBusqueda = 
        usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        usuario.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
        usuario.email.toLowerCase().includes(busqueda.toLowerCase());
      
      return cumpleFiltroRol && cumpleFiltroEstado && cumpleBusqueda;
    });
  }, [usuarios, filtroRol, filtroEstado, busqueda]);

  // Función para obtener el badge del rol
  const getBadgeRol = (rol) => {
    const badges = {
      admin: "badge bg-danger",
      cajero: "badge bg-warning text-dark",
      cliente: "badge bg-primary"
    };
    return badges[rol] || "badge bg-secondary";
  };

  // Función para obtener el badge del estado
  const getBadgeEstado = (estado) => {
    return estado === "activo" ? "badge bg-success" : "badge bg-secondary";
  };

  const handleVerDetalle = (usuario) => {
    setUsuarioSeleccionado(usuario);
  };

  const cerrarModal = () => {
    setUsuarioSeleccionado(null);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      
      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          <Sidebar />

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-3">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center pb-2 mb-4 border-bottom">
              <h1 className="h2 mb-0">
                <i className="bi bi-people me-2"></i>
                Gestión de Usuarios
              </h1>
              <button className="btn btn-primary">
                <i className="bi bi-person-plus me-1"></i>
                Nuevo Usuario
              </button>
            </div>

            {/* Controles de filtro */}
            <div className="row mb-4">
              <div className="col-md-3">
                <label className="form-label fw-bold">Filtrar por Rol</label>
                <select 
                  className="form-select"
                  value={filtroRol}
                  onChange={(e) => setFiltroRol(e.target.value)}
                >
                  <option value="todos">Todos los roles</option>
                  <option value="admin">Administradores</option>
                  <option value="cajero">Cajeros</option>
                  <option value="cliente">Clientes</option>
                </select>
              </div>
              
              <div className="col-md-3">
                <label className="form-label fw-bold">Filtrar por Estado</label>
                <select 
                  className="form-select"
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  <option value="todos">Todos los estados</option>
                  <option value="activo">Activos</option>
                  <option value="inactivo">Inactivos</option>
                </select>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold">Buscar Usuario</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por nombre, apellido o email..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card bg-primary text-white">
                  <div className="card-body text-center">
                    <h4>{usuarios.filter(u => u.rol === 'cliente').length}</h4>
                    <small>Clientes</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-dark">
                  <div className="card-body text-center">
                    <h4>{usuarios.filter(u => u.rol === 'cajero').length}</h4>
                    <small>Cajeros</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-danger text-white">
                  <div className="card-body text-center">
                    <h4>{usuarios.filter(u => u.rol === 'admin').length}</h4>
                    <small>Administradores</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body text-center">
                    <h4>{usuarios.filter(u => u.estado === 'activo').length}</h4>
                    <small>Usuarios Activos</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de usuarios */}
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  Lista de Usuarios ({usuariosFiltrados.length} encontrados)
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Teléfono</th>
                        <th>Último Acceso</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.map((usuario) => (
                        <tr key={usuario.id}>
                          <td className="fw-bold">#{usuario.id}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar me-2">
                                <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white" style={{ width: '35px', height: '35px' }}>
                                  {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
                                </div>
                              </div>
                              <div>
                                <div className="fw-bold">{usuario.nombre} {usuario.apellido}</div>
                                <small className="text-muted">Registrado: {usuario.fechaRegistro}</small>
                              </div>
                            </div>
                          </td>
                          <td>{usuario.email}</td>
                          <td>
                            <span className={`${getBadgeRol(usuario.rol)} text-uppercase`}>
                              {usuario.rol}
                            </span>
                          </td>
                          <td>
                            <span className={`${getBadgeEstado(usuario.estado)} text-uppercase`}>
                              {usuario.estado}
                            </span>
                          </td>
                          <td>{usuario.telefono}</td>
                          <td>
                            <small className="text-muted">{usuario.ultimoAcceso}</small>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleVerDetalle(usuario)}
                                title="Ver detalles"
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-warning"
                                title="Editar"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                title="Eliminar"
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
              </div>
              
              {usuariosFiltrados.length === 0 && (
                <div className="text-center py-5">
                  <i className="bi bi-person-x fs-1 text-muted"></i>
                  <p className="text-muted mt-2">No se encontraron usuarios con los filtros aplicados</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal de detalles del usuario */}
      {usuarioSeleccionado && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-person-circle me-2"></i>
                  Detalles del Usuario
                </h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-primary">Información Personal</h6>
                    <p><strong>Nombre:</strong> {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}</p>
                    <p><strong>Email:</strong> {usuarioSeleccionado.email}</p>
                    <p><strong>Teléfono:</strong> {usuarioSeleccionado.telefono}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-primary">Información del Sistema</h6>
                    <p><strong>Rol:</strong> 
                      <span className={`ms-2 ${getBadgeRol(usuarioSeleccionado.rol)} text-uppercase`}>
                        {usuarioSeleccionado.rol}
                      </span>
                    </p>
                    <p><strong>Estado:</strong>
                      <span className={`ms-2 ${getBadgeEstado(usuarioSeleccionado.estado)} text-uppercase`}>
                        {usuarioSeleccionado.estado}
                      </span>
                    </p>
                    <p><strong>Fecha de Registro:</strong> {usuarioSeleccionado.fechaRegistro}</p>
                    <p><strong>Último Acceso:</strong> {usuarioSeleccionado.ultimoAcceso}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cerrar
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="bi bi-pencil me-1"></i>Editar Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};