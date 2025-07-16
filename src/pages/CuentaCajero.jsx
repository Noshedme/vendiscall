import React, { useState, useRef } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { FaUserTie, FaEdit, FaSave, FaTimes, FaUpload } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import classNames from "classnames";

export function CuentaCajero() {
  const [cajero, setCajero] = useState({
    nombre: "Pedro Cajero",
    email: "cajero@vendismarket.com",
    telefono: "0987654321",
    sucursal: "Sucursal Centro",
  });

  const [foto, setFoto] = useState("/logo.png");
  const [editando, setEditando] = useState(false);
  const [errores, setErrores] = useState({});
  const fileInputRef = useRef();

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

  const guardarCambios = () => {
    const nuevosErrores = {};
    Object.entries(cajero).forEach(([key, val]) => {
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
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-3">
            <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
              <h2 className="text-primary fw-bold mb-0">
                <FaUserTie className="me-2" />
                Cuenta del Cajero
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
                <h4 className="mb-0">Hola, {cajero.nombre.split(" ")[0]} 👋</h4>
                <small className="text-muted">
                  Información personal de tu cuenta como cajero.
                </small>
              </div>
            </motion.div>

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
                  {[
                    { label: "Nombre", name: "nombre" },
                    { label: "Correo electrónico", name: "email" },
                    { label: "Teléfono", name: "telefono" },
                    { label: "Sucursal", name: "sucursal" },
                  ].map(({ label, name }) => (
                    <div className="mb-3" key={name}>
                      <label className="form-label">{label}</label>
                      <input
                        type={name === "email" ? "email" : "text"}
                        className={classNames("form-control", {
                          "is-invalid": errores[name],
                          transition: true,
                        })}
                        name={name}
                        value={cajero[name]}
                        onChange={handleChange}
                        disabled={!editando}
                        onDoubleClick={() => setEditando(true)}
                        title="Doble clic para editar"
                      />
                      {errores[name] && (
                        <div className="invalid-feedback">{errores[name]}</div>
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
          </main>
        </div>
      </div>

      <footer className="bg-danger text-white py-2 mt-auto">
        <div className="text-center">
          <small>
            Vendismarket — Cuenta personal del cajero.
          </small>
        </div>
      </footer>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
