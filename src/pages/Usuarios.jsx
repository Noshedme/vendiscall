import React, { useState, useMemo, useEffect } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

const API_BASE_URL = "http://localhost:3001/api";

export const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroRol, setFiltroRol] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    cedula: "",
    celular: "",
    fecha_nacimiento: "",
    edificio: "",
    departamento: "",
    rol_id: "",
    contrasena: ""
  });

  // Cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/usuarios`);
      const data = await response.json();
      
      if (data.success) {
        setUsuarios(data.data);
      } else {
        setError("Error al cargar usuarios");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const cargarRoles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/roles/all`);
      const data = await response.json();
      
      if (data.success) {
        setRoles(data.data);
      }
    } catch (error) {
      console.error("Error al cargar roles:", error);
    }
  };

  const crearUsuario = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Usuario creado exitosamente");
        setMostrarModalCrear(false);
        limpiarFormulario();
        cargarUsuarios();
      } else {
        alert(data.message || "Error al crear usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    }
  };

  const actualizarUsuario = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioAEditar.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Usuario actualizado exitosamente");
        setMostrarModalEditar(false);
        setUsuarioAEditar(null);
        limpiarFormulario();
        cargarUsuarios();
      } else {
        alert(data.message || "Error al actualizar usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    }
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          alert("Usuario eliminado exitosamente");
          cargarUsuarios();
        } else {
          alert(data.message || "Error al eliminar usuario");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión");
      }
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      nombres: "",
      apellidos: "",
      email: "",
      cedula: "",
      celular: "",
      fecha_nacimiento: "",
      edificio: "",
      departamento: "",
      rol_id: "",
      contrasena: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const abrirModalCrear = () => {
    limpiarFormulario();
    setMostrarModalCrear(true);
  };

  const abrirModalEditar = (usuario) => {
    setUsuarioAEditar(usuario);
    setFormData({
      nombres: usuario.nombre,
      apellidos: usuario.apellido,
      email: usuario.email,
      cedula: usuario.cedula || "",
      celular: usuario.telefono,
      fecha_nacimiento: usuario.fechaNacimiento || "",
      edificio: usuario.edificio || "",
      departamento: usuario.departamento || "",
      rol_id: roles.find(r => r.nombre.toLowerCase() === usuario.rol)?.id || "",
      contrasena: "" // No mostramos la contraseña actual
    });
    setMostrarModalEditar(true);
  };

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
      administrador: "badge bg-danger",
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
    setMostrarModalCrear(false);
    setMostrarModalEditar(false);
    setUsuarioAEditar(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

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
              <button className="btn btn-primary" onClick={abrirModalCrear}>
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
                  <option value="administrador">Administradores</option>
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
                    <h4>{usuarios.filter(u => u.rol === 'administrador').length}</h4>
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
                        <th>Cédula</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Teléfono</th>
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
                                <small className="text-muted">Edificio: {usuario.edificio || 'N/A'} - Depto: {usuario.departamento || 'N/A'}</small>
                              </div>
                            </div>
                          </td>
                          <td>{usuario.email}</td>
                          <td>{usuario.cedula || 'N/A'}</td>
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
                                onClick={() => abrirModalEditar(usuario)}
                                title="Editar"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => eliminarUsuario(usuario.id)}
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
                    <p><strong>Cédula:</strong> {usuarioSeleccionado.cedula || 'N/A'}</p>
                    <p><strong>Teléfono:</strong> {usuarioSeleccionado.telefono}</p>
                    <p><strong>Edificio:</strong> {usuarioSeleccionado.edificio || 'N/A'}</p>
                    <p><strong>Departamento:</strong> {usuarioSeleccionado.departamento || 'N/A'}</p>
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
                <button type="button" className="btn btn-primary" onClick={() => abrirModalEditar(usuarioSeleccionado)}>
                  <i className="bi bi-pencil me-1"></i>Editar Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para crear usuario */}
      {mostrarModalCrear && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-person-plus me-2"></i>
                  Crear Nuevo Usuario
                </h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Nombres *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Apellidos *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Cédula *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cedula"
                        value={formData.cedula}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Contraseña *</label>
                      <input
                        type="password"
                        className="form-control"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Celular *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="celular"
                        value={formData.celular}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Fecha de Nacimiento</label>
                      <input
                        type="date"
                        className="form-control"
                        name="fecha_nacimiento"
                        value={formData.fecha_nacimiento}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Edificio</label>
                      <input
                        type="text"
                        className="form-control"
                        name="edificio"
                        value={formData.edificio}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Departamento</label>
                      <input
                        type="text"
                        className="form-control"
                        name="departamento"
                        value={formData.departamento}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Rol *</label>
                      <select
                        className="form-select"
                        name="rol_id"
                        value={formData.rol_id}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccionar rol</option>
                        {roles.map(rol => (
                          <option key={rol.id} value={rol.id}>
                            {rol.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={crearUsuario}>
                  <i className="bi bi-person-plus me-1"></i>
                  Crear Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar usuario */}
      {mostrarModalEditar && usuarioAEditar && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-pencil me-2"></i>
                  Editar Usuario: {usuarioAEditar.nombre} {usuarioAEditar.apellido}
                </h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Nombres *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Apellidos *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Cédula *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cedula"
                        value={formData.cedula}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Celular *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="celular"
                        value={formData.celular}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Fecha de Nacimiento</label>
                      <input
                        type="date"
                        className="form-control"
                        name="fecha_nacimiento"
                        value={formData.fecha_nacimiento}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Edificio</label>
                      <input
                        type="text"
                        className="form-control"
                        name="edificio"
                        value={formData.edificio}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Departamento</label>
                      <input
                        type="text"
                        className="form-control"
                        name="departamento"
                        value={formData.departamento}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Rol *</label>
                      <select
                        className="form-select"
                        name="rol_id"
                        value={formData.rol_id}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccionar rol</option>
                        {roles.map(rol => (
                          <option key={rol.id} value={rol.id}>
                            {rol.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Nota: La contraseña no se puede editar desde aquí. Para cambiar la contraseña, el usuario debe usar la función de recuperación.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={actualizarUsuario}>
                  <i className="bi bi-check-lg me-1"></i>
                  Actualizar Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};