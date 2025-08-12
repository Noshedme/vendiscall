// src/pages/CategoriasProductos.jsx
import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useCarrito } from "../hooks/useCarrito";
import { FaShoppingCart, FaSearch, FaFilter, FaPlus, FaTags, FaBoxOpen, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

export const CategoriasProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  
  const {
    carrito,
    agregarAlCarrito,
    obtenerCantidadTotal,
    obtenerCantidadProducto
  } = useCarrito();
  
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 500 });
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/productos");
      const data = await response.json();
      setProductos(data);
      
      // Extraer categorías únicas
      const categoriasUnicas = [...new Set(data.map(p => p.categoria))];
      setCategorias(categoriasUnicas);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      toast.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const manejarAgregarAlCarrito = async (producto) => {
    const success = await agregarAlCarrito(producto);
    if (!success) {
      console.log("No se pudo agregar al carrito, revisa la consola");
    }
  };

  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                           producto.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
                           producto.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideCategoria = categoriaFiltro === "" || producto.categoria === categoriaFiltro;
    
    return coincideBusqueda && coincideCategoria;
  });

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

  const totalItemsCarrito = obtenerCantidadTotal();

  const irAlCarrito = () => {
    navigate("/cliente/carrito");
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
            {/* Header con contador de carrito */}
            <div className="d-flex justify-content-between align-items-center border-bottom mb-4">
              <h2 className="text-primary fw-bold mb-0">
                <FaTags className="me-2" />
                Tienda
              </h2>
              <div className="d-flex align-items-center gap-3">
                <span className="badge bg-secondary fs-6">
                  {productosFiltrados.length} productos
                </span>
                <button
                  className="btn btn-outline-danger position-relative"
                  onClick={irAlCarrito}
                  title="Ver carrito"
                >
                  <FaShoppingCart className="fs-5" />
                  {totalItemsCarrito > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {totalItemsCarrito}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Filtros */}
            <div className="row g-3 mb-4">
              <div className="col-md-8">
                <div className="input-group shadow-sm">
                  <span className="input-group-text bg-primary text-white">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Buscar productos por nombre, código o descripción..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="input-group shadow-sm">
                  <span className="input-group-text bg-warning text-dark">
                    <FaFilter />
                  </span>
                  <select
                    className="form-select form-select-lg"
                    value={categoriaFiltro}
                    onChange={(e) => setCategoriaFiltro(e.target.value)}
                  >
                    <option value="">Todas las categorías</option>
                    {categorias.map(categoria => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Categorías como chips */}
            {categorias.length > 0 && (
              <div className="mb-4">
                <h6 className="text-muted mb-2">Categorías disponibles:</h6>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    className={`btn btn-sm ${categoriaFiltro === "" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setCategoriaFiltro("")}
                  >
                    Todas
                  </button>
                  {categorias.map(categoria => (
                    <button
                      key={categoria}
                      className={`btn btn-sm ${categoriaFiltro === categoria ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setCategoriaFiltro(categoria)}
                    >
                      {categoria}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Grid de productos */}
            <div className="row g-4">
              {productosFiltrados.map((producto, index) => {
                const cantidadEnCarrito = obtenerCantidadProducto(producto.id);
                const stockDisponible = producto.stock - cantidadEnCarrito;
                
                return (
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
                      {/* Imagen del producto (placeholder) */}
                      <div 
                        className="card-img-top d-flex align-items-center justify-content-center bg-light position-relative"
                        style={{ height: "200px" }}
                      >
                        <FaBoxOpen className="fs-1 text-muted" />
                        
                        {/* Badge de cantidad en carrito */}
                        {cantidadEnCarrito > 0 && (
                          <span className="position-absolute top-0 end-0 m-2 badge bg-success rounded-pill">
                            En carrito: {cantidadEnCarrito}
                          </span>
                        )}
                      </div>

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
                            <span className="text-success fs-4 fw-bold">
                              ${parseFloat(producto.precio).toFixed(2)}
                            </span>
                            <div className="text-end">
                              <span className="text-muted small d-block">
                                Stock: {producto.stock}
                              </span>
                              {cantidadEnCarrito > 0 && (
                                <span className="text-success small d-block">
                                  Disponible: {stockDisponible}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto">
                          {stockDisponible > 0 ? (
                            <button
                              className="btn btn-success w-100"
                              onClick={() => manejarAgregarAlCarrito(producto)}
                            >
                              <FaPlus className="me-2" />
                              {cantidadEnCarrito > 0 ? "Agregar más" : "Agregar al carrito"}
                            </button>
                          ) : (
                            <div className="d-grid gap-1">
                              <button
                                className="btn btn-secondary w-100"
                                disabled
                              >
                                {producto.stock === 0 ? "Sin stock" : "En carrito (máx)"}
                              </button>
                              {cantidadEnCarrito > 0 && (
                                <button
                                  className="btn btn-outline-primary btn-sm w-100"
                                  onClick={irAlCarrito}
                                >
                                  <FaEye className="me-1" />
                                  Ver en carrito
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Mensaje cuando no hay productos */}
            {productosFiltrados.length === 0 && (
              <motion.div
                className="text-center py-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FaBoxOpen className="fs-1 text-muted mb-3" />
                <h4 className="text-muted">No se encontraron productos</h4>
                <p className="text-muted">
                  {busqueda || categoriaFiltro 
                    ? "Intenta con otros términos de búsqueda o filtros" 
                    : "No hay productos disponibles en este momento"}
                </p>
                {(busqueda || categoriaFiltro) && (
                  <button
                    className="btn btn-outline-primary mt-3"
                    onClick={() => {
                      setBusqueda("");
                      setCategoriaFiltro("");
                    }}
                  >
                    Limpiar filtros
                  </button>
                )}
              </motion.div>
            )}

            {/* Floating Action Button para carrito en móviles */}
            {totalItemsCarrito > 0 && (
              <div 
                className="position-fixed bottom-0 end-0 p-3 d-md-none"
                style={{ zIndex: 1050 }}
              >
                <button
                  className="btn btn-success btn-lg rounded-circle shadow-lg position-relative"
                  onClick={irAlCarrito}
                  style={{ width: "60px", height: "60px" }}
                >
                  <FaShoppingCart />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {totalItemsCarrito}
                  </span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <footer className="bg-danger text-white py-2 text-center mt-auto">
        <small>Vendismarket — Tu tienda online de confianza.</small>
      </footer>
    </div>
  );
};