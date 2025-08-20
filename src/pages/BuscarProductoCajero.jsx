// src/pages/BuscarProductoCajero.jsx
import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { FaSearch, FaBoxOpen, FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

export function BuscarProductoCajero() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtrados, setFiltrados] = useState([]);
  const [expandido, setExpandido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 500 });
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/productos");
      const data = await response.json();
      setProductos(data);
      setFiltrados(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      toast.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const texto = busqueda.toLowerCase();
    const resultado = productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(texto) ||
        p.codigo.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto)
    );
    setFiltrados(resultado);
    setExpandido(null);
  }, [busqueda, productos]);

  const toggleExpansion = (id) => {
    setExpandido(expandido === id ? null : id);
  };

  const getStockBadge = (stock) => {
    if (stock <= 0) return "bg-danger";
    if (stock <= 5) return "bg-warning";
    return "bg-success";
  };

  const getStockText = (stock) => {
    if (stock <= 0) return "Sin stock";
    if (stock <= 5) return "Poco stock";
    return "Disponible";
  };

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <div className="container-fluid flex-grow-1 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando productos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <ToastContainer />
      <div className="container-fluid flex-grow-1">
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            {/* Encabezado */}
            <div className="d-flex justify-content-between align-items-center border-bottom mb-4">
              <h2 className="text-primary fw-bold mb-0">
                <FaSearch className="me-2" />
                Buscar Productos
              </h2>
              <span className="badge bg-secondary fs-6">
                {filtrados.length} productos encontrados
              </span>
            </div>

            {/* Buscador */}
            <div className="input-group mb-4 shadow-sm">
              <span className="input-group-text bg-danger text-white">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Buscar por nombre, código o descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            {/* Grid de productos */}
            <div className="row g-4">
              {filtrados.map((producto, index) => (
                <div key={producto.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                  <motion.div
                    className="card h-100 shadow-sm border-0"
                    data-aos="fade-up"
                    data-aos-delay={index * 50}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    {/* Imagen/ícono */}
                    <div
                      className="card-img-top d-flex align-items-center justify-content-center bg-light position-relative"
                      style={{ height: "180px" }}
                    >
                      <FaBoxOpen className="fs-1 text-muted" />
                    </div>

                    {/* Info */}
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="badge bg-primary">{producto.categoria}</span>
                        <span className={`badge ${getStockBadge(producto.stock)}`}>
                          {getStockText(producto.stock)}
                        </span>
                      </div>

                      <h5 className="card-title text-danger fw-bold mb-2">
                        {producto.nombre}
                      </h5>

                      <p className="text-muted small mb-2">
                        <strong>Código:</strong> {producto.codigo}
                      </p>

                      <p className="card-text text-muted small mb-3 flex-grow-1">
                        {producto.descripcion}
                      </p>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-success fs-5 fw-bold">
                            ${parseFloat(producto.precio).toFixed(2)}
                          </span>
                          <span className="text-muted small">Stock: {producto.stock}</span>
                        </div>
                      </div>

                      {/* Botón para seleccionar en venta */}
                      <div className="mt-auto">
                        {producto.stock > 0 ? (
                          <button
                            className="btn btn-success w-100"
                            onClick={() => {
                              toast.success(`${producto.nombre} seleccionado para venta`);
                            }}
                          >
                            <FaPlus className="me-2" />
                            Seleccionar
                          </button>
                        ) : (
                          <button className="btn btn-secondary w-100" disabled>
                            Sin stock
                          </button>
                        )}
                      </div>

                      {/* Expansión de detalles */}
                      <div
                        className="text-center mt-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleExpansion(producto.id)}
                      >
                        {expandido === producto.id ? (
                          <FaChevronUp className="text-muted" />
                        ) : (
                          <FaChevronDown className="text-muted" />
                        )}
                      </div>
                      <AnimatePresence>
                        {expandido === producto.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden mt-3"
                          >
                            <div className="bg-light rounded p-3">
                              <h6 className="text-muted mb-1">Detalles</h6>
                              <p className="text-dark small mb-0">{producto.descripcion}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Mensaje vacío */}
            {filtrados.length === 0 && (
              <motion.div
                className="text-center py-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FaBoxOpen className="fs-1 text-muted mb-3" />
                <h4 className="text-muted">No se encontraron productos</h4>
                <p className="text-muted">Intenta con otros términos de búsqueda</p>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      <footer className="bg-danger text-white py-2 text-center mt-auto">
        <small>Vendismarket — Búsqueda interactiva de productos (Cajero).</small>
      </footer>
    </div>
  );
}
