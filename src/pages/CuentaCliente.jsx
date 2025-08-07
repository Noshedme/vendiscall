//CuentaCliente.jsx
import React, { useState, useRef, useEffect } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { FaUserCircle, FaEdit, FaSave, FaTimes, FaUpload } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import classNames from "classnames";
import { useAuth } from "../context/AuthContext"; // Importar el contexto de auth

export function CuentaCliente() {
  const { user } = useAuth(); // Obtener usuario del contexto
  
  const [cliente, setCliente] = useState({
    nombres: "",
    apellidos: "",
    usuario: "", // Cambiado de email a usuario
    celular: "",
    cedula: "",
    fecha_nacimiento: "",
    edificio: "",
    departamento: "",
  });

  const [foto, setFoto] = useState("/logo.png");
  const [editando, setEditando] = useState(false);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(true);
  const fileInputRef = useRef();

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (user && user.id) {
      cargarDatosUsuario();
    }
  }, [user]);

  // Función para cargar datos del usuario desde la API
  const cargarDatosUsuario = async () => {
    try {
      setCargando(true);
      const response = await fetch(`http://localhost:3001/api/usuarios/${user.id}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const userData = result.data;
          setCliente({
            nombres: userData.nombre || "",
            apellidos: userData.apellido || "",
            usuario: userData.email || "", // El email es en realidad el usuario
            celular: userData.telefono || "",
            cedula: userData.cedula || "",
            fecha_nacimiento: userData.fechaNacimiento || "",
            edificio: userData.edificio || "",
            departamento: userData.departamento || "",
          });
        }
      } else {
        toast.error("Error al cargar los datos del usuario");
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error de conexión al cargar los datos");
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });

    // Validaciones en tiempo real
    const nuevosErrores = { ...errores };
    if (!value.trim()) {
      nuevosErrores[name] = "Este campo es obligatorio";
    } else {
      delete nuevosErrores[name];
    }
    setErrores(nuevosErrores);
  };

  const guardarCambios = async () => {
    // Validaciones antes de enviar
    const nuevosErrores = {};
    Object.entries(cliente).forEach(([key, val]) => {
      if (!val.trim()) nuevosErrores[key] = "Este campo es obligatorio";
    });

    // Validación específica para usuario (sin validación de formato email)
    if (cliente.usuario && cliente.usuario.length < 3) {
      nuevosErrores.usuario = "El usuario debe tener al menos 3 caracteres";
    }

    // Validación específica para cédula (10 dígitos)
    if (cliente.cedula && cliente.cedula.length !== 10) {
      nuevosErrores.cedula = "La cédula debe tener 10 dígitos";
    }

    // Validación específica para celular
    if (cliente.celular && cliente.celular.length !== 10) {
      nuevosErrores.celular = "El celular debe tener 10 dígitos";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      toast.error("Por favor corrige los errores en el formulario.");
      return;
    }

    try {
      setCargando(true);
      
      // Preparar datos para enviar al backend
      const datosActualizacion = {
        email: cliente.usuario, // Enviamos usuario como email al backend
        cedula: cliente.cedula,
        nombres: cliente.nombres,
        apellidos: cliente.apellidos,
        celular: cliente.celular,
        fecha_nacimiento: cliente.fecha_nacimiento,
        edificio: cliente.edificio,
        departamento: cliente.departamento,
        rol_id: user.rol_id // Mantener el rol actual
      };

      const response = await fetch(`http://localhost:3001/api/usuarios/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosActualizacion),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setEditando(false);
          toast.success("Datos actualizados correctamente.");
          
          // Actualizar los datos en el contexto si es necesario
          // Esto dependerá de cómo manejes el contexto global
        } else {
          toast.error(result.message || "Error al actualizar los datos");
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Error al actualizar los datos");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Error de conexión al guardar los cambios");
    } finally {
      setCargando(false);
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result);
        // Aquí podrías agregar lógica para subir la imagen al servidor
        toast.info("Funcionalidad de cambio de foto en desarrollo");
      };
      reader.readAsDataURL(file);
    }
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setErrores({});
    // Recargar los datos originales
    cargarDatosUsuario();
  };

  // Mostrar loading mientras cargan los datos
  if (cargando && !cliente.nombres) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <div className="container-fluid flex-grow-1 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando datos del usuario...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container-fluid flex-grow-1">
        <div className="row">
          <Sidebar />
          <main
            className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-3"
            style={{ paddingBottom: "80px" }}
          >
            <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
              <h2 className="text-primary fw-bold mb-0">
                <FaUserCircle className="me-2" />
                Mi Cuenta
              </h2>
            </div>

            <motion.div
              className="d-flex align-items-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="position-relative me-3">
                <img
                  src={foto}
                  alt="Avatar"
                  className="rounded-circle"
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    border: "3px solid var(--rojo)",
                  }}
                />
                <button
                  className="btn btn-sm btn-outline-secondary position-absolute bottom-0 end-0 rounded-circle"
                  style={{ padding: "0.3rem" }}
                  onClick={() => fileInputRef.current.click()}
                  title="Cambiar foto"
                >
                  <FaUpload size={12} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFotoChange}
                  hidden
                />
              </div>
              <div>
                <h4 className="mb-0">
                  Hola, {cliente.nombres ? cliente.nombres.split(" ")[0] : "Usuario"} 👋
                </h4>
                <small className="text-muted">
                  ¡Bienvenido a tu cuenta de VendisMarket!
                </small>
              </div>
            </motion.div>

            <div className="row g-3">
              {/* Formulario */}
              <div className="col-12">
                <motion.div
                  className="card shadow-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="card-header bg-warning">
                    <h5 className="mb-0">Datos del Cliente</h5>
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="row">
                        {/* Nombres */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Nombres</label>
                          <input
                            type="text"
                            className={classNames("form-control", {
                              "is-invalid": errores.nombres,
                            })}
                            name="nombres"
                            value={cliente.nombres}
                            onChange={handleChange}
                            disabled={!editando}
                            onDoubleClick={() => setEditando(true)}
                            title="Doble clic para editar"
                          />
                          {errores.nombres && (
                            <div className="invalid-feedback">{errores.nombres}</div>
                          )}
                        </div>

                        {/* Apellidos */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Apellidos</label>
                          <input
                            type="text"
                            className={classNames("form-control", {
                              "is-invalid": errores.apellidos,
                            })}
                            name="apellidos"
                            value={cliente.apellidos}
                            onChange={handleChange}
                            disabled={!editando}
                            onDoubleClick={() => setEditando(true)}
                            title="Doble clic para editar"
                          />
                          {errores.apellidos && (
                            <div className="invalid-feedback">{errores.apellidos}</div>
                          )}
                        </div>
                      </div>

                      <div className="row">
                        {/* Usuario */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Usuario</label>
                          <input
                            type="text"
                            className={classNames("form-control", {
                              "is-invalid": errores.usuario,
                            })}
                            name="usuario"
                            value={cliente.usuario}
                            onChange={handleChange}
                            disabled={!editando}
                            onDoubleClick={() => setEditando(true)}
                            title="Doble clic para editar"
                          />
                          {errores.usuario && (
                            <div className="invalid-feedback">{errores.usuario}</div>
                          )}
                        </div>

                        {/* Cédula */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Cédula</label>
                          <input
                            type="text"
                            className={classNames("form-control", {
                              "is-invalid": errores.cedula,
                            })}
                            name="cedula"
                            value={cliente.cedula}
                            onChange={handleChange}
                            disabled={!editando}
                            onDoubleClick={() => setEditando(true)}
                            title="Doble clic para editar"
                            maxLength="10"
                          />
                          {errores.cedula && (
                            <div className="invalid-feedback">{errores.cedula}</div>
                          )}
                        </div>
                      </div>

                      <div className="row">
                        {/* Celular */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Celular</label>
                          <input
                            type="tel"
                            className={classNames("form-control", {
                              "is-invalid": errores.celular,
                            })}
                            name="celular"
                            value={cliente.celular}
                            onChange={handleChange}
                            disabled={!editando}
                            onDoubleClick={() => setEditando(true)}
                            title="Doble clic para editar"
                            maxLength="10"
                          />
                          {errores.celular && (
                            <div className="invalid-feedback">{errores.celular}</div>
                          )}
                        </div>

                        {/* Fecha de Nacimiento */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Fecha de Nacimiento</label>
                          <input
                            type="date"
                            className={classNames("form-control", {
                              "is-invalid": errores.fecha_nacimiento,
                            })}
                            name="fecha_nacimiento"
                            value={cliente.fecha_nacimiento}
                            onChange={handleChange}
                            disabled={!editando}
                            onDoubleClick={() => setEditando(true)}
                            title="Doble clic para editar"
                          />
                          {errores.fecha_nacimiento && (
                            <div className="invalid-feedback">{errores.fecha_nacimiento}</div>
                          )}
                        </div>
                      </div>

                      <div className="row">
                        {/* Edificio */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Edificio</label>
                          <input
                            type="text"
                            className={classNames("form-control", {
                              "is-invalid": errores.edificio,
                            })}
                            name="edificio"
                            value={cliente.edificio}
                            onChange={handleChange}
                            disabled={!editando}
                            onDoubleClick={() => setEditando(true)}
                            title="Doble clic para editar"
                          />
                          {errores.edificio && (
                            <div className="invalid-feedback">{errores.edificio}</div>
                          )}
                        </div>

                        {/* Departamento */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Departamento</label>
                          <input
                            type="text"
                            className={classNames("form-control", {
                              "is-invalid": errores.departamento,
                            })}
                            name="departamento"
                            value={cliente.departamento}
                            onChange={handleChange}
                            disabled={!editando}
                            onDoubleClick={() => setEditando(true)}
                            title="Doble clic para editar"
                          />
                          {errores.departamento && (
                            <div className="invalid-feedback">{errores.departamento}</div>
                          )}
                        </div>
                      </div>

                      <div className="d-flex justify-content-end">
                        {!editando ? (
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => setEditando(true)}
                          >
                            <FaEdit className="me-1" /> Editar
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="btn btn-success me-2"
                              onClick={guardarCambios}
                              disabled={cargando}
                            >
                              <FaSave className="me-1" /> 
                              {cargando ? "Guardando..." : "Guardar"}
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={cancelarEdicion}
                              disabled={cargando}
                            >
                              <FaTimes className="me-1" /> Cancelar
                            </button>
                          </>
                        )}
                      </div>
                    </form>
                  </div>
                </motion.div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <footer className="bg-danger text-white py-2 mt-auto">
        <div className="text-center px-3">
          <small>
            Vendismarket S.A.S. (local) VendisCall — Av. González Suárez N32-17, Edif. Cc la Frutería Pb Local 3, Quito; Pichincha.
          </small>
        </div>
      </footer>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}