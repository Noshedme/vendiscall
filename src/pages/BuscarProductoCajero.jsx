import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
// ❌ ELIMINA: import { productos } from "../data/productos";
import { FaSearch, FaBoxOpen, FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast } from "react-toastify";

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
        p.codigo.toLowerCase().includes(texto)
    );
    setFiltrados(resultado);
    // Cerrar todos los desplegables al buscar
    setExpandido(null);
  }, [busqueda, productos]);

  const toggleExpansion = (id) => {
    setExpandido(expandido === id ? null : id);
  };

  const getStockColor = (stock) => {
    if (stock <= 5) return "text-danger";
    if (stock <= 20) return "text-warning";
    return "text-success";
  };

  const getStockBadge = (stock) => {
    if (stock <= 5) return "bg-danger";
    if (stock <= 20) return "bg-warning";
    return "bg-success";
  };

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <div className="container-fluid flex-grow-1">
          <div className="row">
            <Sidebar />
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando productos...</p>
              </div>
            </main>
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
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            <div className="d-flex justify-content-between align-items-center border-bottom mb-4">
              <h2 className="text-primary fw-bold mb-0">
                <FaSearch className="me-2" />
                Buscar Productos
              </h2>
              <span className="badge bg-secondary fs-6">
                {filtrados.length} productos encontrados
              </span>
            </div>

            <div className="input-group mb-4 shadow-sm">
              <span className="input-group-text bg-danger text-white">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Buscar por nombre o código..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="list-group shadow-sm">
              {filtrados.map((producto, index) => (
                <motion.div
                  key={producto.id}
                  className="list-group-item list-group-item-action border-0 mb-2 rounded"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className="d-flex align-items-center justify-content-between p-3 cursor-pointer"
                    onClick={() => toggleExpansion(producto.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center flex-grow-1">
                      <div className="me-3">
                        <FaBoxOpen className="fs-3 text-warning" />
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1 fw-bold text-danger">
                          {producto.nombre}
                        </h5>
                        <div className="d-flex align-items-center gap-3">
                          <span className="text-muted small">
                            <strong>Código:</strong> {producto.codigo}
                          </span>
                          <span className={`badge ${getStockBadge(producto.stock)}`}>
                            Stock: {producto.stock}
                          </span>
                          <span className="text-primary fw-bold">
                            ${parseFloat(producto.precio).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <motion.button
                        className="btn btn-success btn-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Aquí iría la lógica para añadir a venta
                          toast.success(`${producto.nombre} seleccionado para venta`);
                        }}
                      >
                        <FaPlus className="me-1" />
                        Ver más
                      </motion.button>
                      <motion.div
                        animate={{ rotate: expandido === producto.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {expandido === producto.id ? (
                          <FaChevronUp className="text-muted" />
                        ) : (
                          <FaChevronDown className="text-muted" />
                        )}
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandido === producto.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-top pt-3 px-3 pb-3">
                          <div className="row g-3">
                            <div className="col-md-4">
                              <div className="bg-light rounded p-3 text-center">
                                <h6 className="text-muted mb-1">Categoría</h6>
                                <span className="badge bg-primary fs-6">
                                  {producto.categoria}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="bg-light rounded p-3 text-center">
                                <h6 className="text-muted mb-1">Stock Disponible</h6>
                                <span className={`fs-4 fw-bold ${getStockColor(producto.stock)}`}>
                                  {producto.stock}
                                </span>
                                <div className="small text-muted">
                                  {producto.stock <= 5 && "⚠️ Stock bajo"}
                                  {producto.stock > 5 && producto.stock <= 20 && "⚡ Stock medio"}
                                  {producto.stock > 20 && "✅ Stock bueno"}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="bg-light rounded p-3 text-center">
                                <h6 className="text-muted mb-1">Precio Unitario</h6>
                                <span className="fs-4 fw-bold text-success">
                                  ${parseFloat(producto.precio).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col-12">
                              <div className="bg-light rounded p-3">
                                <h6 className="text-muted mb-1">Descripción</h6>
                                <p className="text-dark mb-0">{producto.descripcion}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {filtrados.length === 0 && (
              <motion.div
                className="text-center py-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FaBoxOpen className="fs-1 text-muted mb-3" />
                <h4 className="text-muted">No se encontraron productos</h4>
                <p className="text-muted">
                  Intenta con otros términos de búsqueda
                </p>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      <footer className="bg-danger text-white py-2 text-center mt-auto">
        <small>Vendismarket — Búsqueda interactiva de productos.</small>
      </footer>
    </div>
  );
}