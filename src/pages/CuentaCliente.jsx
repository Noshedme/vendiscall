import React, { useState, useRef } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { FaUserCircle, FaEdit, FaSave, FaTimes, FaUpload } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import classNames from "classnames";

export function CuentaCliente() {
  const [cliente, setCliente] = useState({
    nombre: "Juan Cliente",
    email: "cliente@vendismarket.com",
    telefono: "0999999999",
    direccion: "Av. Siempre Viva 123",
  });

  const [foto, setFoto] = useState("/logo.png");
  const [editando, setEditando] = useState(false);
  const [errores, setErrores] = useState({});
  const fileInputRef = useRef();

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

  const guardarCambios = () => {
    const nuevosErrores = {};
    Object.entries(cliente).forEach(([key, val]) => {
      if (!val.trim()) nuevosErrores[key] = "Este campo es obligatorio";
    });

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      toast.error("Por favor completa todos los campos.");
      return;
    }

    setEditando(false);
    toast.success("Datos actualizados correctamente.");
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container-fluid flex-grow-1">
        <div className="row">
          <Sidebar />
          <main
            className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-3"
            style={{ paddingBottom: "80px" }} // para que no quede pegado al footer
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
                <h4 className="mb-0">Hola, {cliente.nombre.split(" ")[0]} 👋</h4>
                <small className="text-muted">
                  ¡Bienvenido a tu cuenta de VendisMarket!
                </small>
              </div>
            </motion.div>

            <div className="row g-3">
              {/* Formulario */}
              <div className="col-lg-7">
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
                      {["nombre", "email", "telefono", "direccion"].map((campo) => (
                        <div className="mb-3" key={campo}>
                          <label className="form-label text-capitalize">{campo}</label>
                          <input
                            type={campo === "email" ? "email" : "text"}
                            className={classNames("form-control", {
                              "is-invalid": errores[campo],
                              transition: true,
                            })}
                            name={campo}
                            value={cliente[campo]}
                            onChange={handleChange}
                            disabled={!editando}
                            onDoubleClick={() => setEditando(true)}
                            title="Doble clic para editar"
                          />
                          {errores[campo] && (
                            <div className="invalid-feedback">{errores[campo]}</div>
                          )}
                        </div>
                      ))}

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
                            >
                              <FaSave className="me-1" /> Guardar
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setEditando(false)}
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
