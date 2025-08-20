import React, { useState, useRef, useEffect } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { FaUserTie, FaEdit, FaSave, FaTimes, FaUpload } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import classNames from "classnames";
import { useAuth } from "../context/AuthContext"; // Usar contexto de autenticación

export function CuentaCajero() {
  const { user } = useAuth(); // Obtener cajero logueado

  const [cajero, setCajero] = useState({
    nombre: "",
    email: "",
    telefono: "",
    sucursal: "",
  });

  const [foto, setFoto] = useState("/logo.png");
  const [editando, setEditando] = useState(false);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(true);
  const fileInputRef = useRef();

  // Cargar datos del cajero al montar
  useEffect(() => {
    if (user && user.id) {
      cargarDatosCajero();
    }
  }, [user]);

  // Simulación de carga de datos desde backend
  const cargarDatosCajero = async () => {
    try {
      setCargando(true);
      // Aquí deberías hacer fetch a tu API real
      // Simulación:
      setTimeout(() => {
        setCajero({
          nombre: user.nombre || "",
          email: user.email || "",
          telefono: user.telefono || "",
          sucursal: user.sucursal || "",
        });
        setCargando(false);
      }, 500);
    } catch (error) {
      toast.error("Error al cargar los datos del cajero");
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCajero({ ...cajero, [name]: value });

    const nuevosErrores = { ...errores };
    if (!value.trim()) {
      nuevosErrores[name] = "Este campo es obligatorio";
    } else {
      delete nuevosErrores[name];
    }
    setErrores(nuevosErrores);
  };

  const guardarCambios = async () => {
    const nuevosErrores = {};
    Object.entries(cajero).forEach(([key, val]) => {
      if (!val.trim()) nuevosErrores[key] = "Este campo es obligatorio";
    });

    if (cajero.telefono && cajero.telefono.length !== 10) {
      nuevosErrores.telefono = "El teléfono debe tener 10 dígitos";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      toast.error("Por favor corrige los errores en el formulario.");
      return;
    }

    try {
      setCargando(true);
      // Aquí deberías hacer fetch PUT a tu API real
      setTimeout(() => {
        setEditando(false);
        toast.success("Datos actualizados correctamente.");
        setCargando(false);
      }, 700);
    } catch (error) {
      toast.error("Error al guardar los cambios");
      setCargando(false);
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result);
        toast.info("Funcionalidad de cambio de foto en desarrollo");
      };
      reader.readAsDataURL(file);
    }
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setErrores({});
    cargarDatosCajero();
  };

  if (cargando && !cajero.nombre) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <div className="container-fluid flex-grow-1 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando datos del cajero...</p>
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
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-3" style={{ paddingBottom: "80px" }}>
            <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
              <h2 className="text-primary fw-bold mb-0">
                <FaUserTie className="me-2" />
                Mi Cuenta (Cajero)
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
                  Hola, {cajero.nombre ? cajero.nombre.split(" ")[0] : "Cajero"} 👋
                </h4>
                <small className="text-muted">
                  Información personal de tu cuenta como cajero.
                </small>
              </div>
            </motion.div>

            <div className="row g-3">
              <div className="col-12">
                <motion.div
                  className="card shadow-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="card-header bg-warning">
                    <h5 className="mb-0">Datos del Cajero</h5>
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="row">
                        {/* Nombre */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Nombre</label>
                          <input
                            type="text"
                            className={classNames("form-control", {
                              "is-invalid": errores.nombre,
                            })}
                            name="nombre"
                            value={cajero.nombre}
                            onChange={handleChange}
                            disabled={!editando}
                            onDoubleClick={() => setEditando(true)}
                            title="Doble clic para editar"
                          />
                          {errores.nombre && (
                            <div className="invalid-feedback">{errores.nombre}</div>
                          )}
                        </div>
                        {/* Email */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Correo electrónico</label>
                          <input
                            type="email"
                            className={classNames("form-control", {
                              "is-invalid": errores.email,
                            })}
                            name="email"
                            value={cajero.email}
                            onChange={handleChange}
                            disabled={!editando}
                            onDoubleClick={() => setEditando(true)}
                            title="Doble clic para editar"
                          />
                          {errores.email && (
                            <div className="invalid-feedback">{errores.email}</div>
                          )}
                        </div>
                      </div>
                      <div className="row">
                        {/* Teléfono */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Teléfono</label>
                          <input
                            type="tel"
                            className={classNames("form-control", {
                              "is-invalid": errores.telefono,
                            })}
                            name="telefono"
                            value={cajero.telefono}
                            onChange={handleChange}
                            disabled={!editando}
                            onDoubleClick={() => setEditando(true)}
                            title="Doble clic para editar"
                            maxLength="10"
                          />
                          {errores.telefono && (
                            <div className="invalid-feedback">{errores.telefono}</div>
                          )}
                        </div>
                        {/* Sucursal */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Sucursal</label>
                          <input
                            type="text"
                            className={classNames("form-control", {
                              "is-invalid": errores.sucursal,
                            })}
                            name="sucursal"
                            value={cajero.sucursal}
                            onChange={handleChange}
                            disabled={!editando}
                            onDoubleClick={() => setEditando(true)}
                            title="Doble clic para editar"
                          />
                          {errores.sucursal && (
                            <div className="invalid-feedback">{errores.sucursal}</div>
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
            Vendismarket — Cuenta personal del cajero.
          </small>
        </div>
      </footer>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
