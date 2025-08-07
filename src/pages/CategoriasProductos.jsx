// src/pages/CategoriasProductos.jsx
import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { FaShoppingCart, FaSearch, FaFilter, FaPlus, FaTags, FaBoxOpen, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
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
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 500 });
    cargarProductos();
    cargarCarritoLocal();
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

  const cargarCarritoLocal = () => {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  };

  const guardarCarritoLocal = (nuevoCarrito) => {
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    setCarrito(nuevoCarrito);
  };

  const agregarAlCarrito = (producto) => {
    const carritoActual = [...carrito];
    const productoExistente = carritoActual.find(item => item.id === producto.id);

    if (productoExistente) {
      if (productoExistente.cantidad < producto.stock) {
        productoExistente.cantidad += 1;
        toast.success(`${producto.nombre} agregado al carrito`);
      } else {
        toast.warning(`No hay más stock disponible de ${producto.nombre}`);
        return;
      }
    } else {
      if (producto.stock > 0) {
        carritoActual.push({
          id: producto.id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1,
          stock: producto.stock
        });
        toast.success(`${producto.nombre} agregado al carrito`);
      } else {
        toast.error(`${producto.nombre} no tiene stock disponible`);
        return;
      }
    }

    guardarCarritoLocal(carritoActual);
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

  const totalItemsCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);

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
                <div className="position-relative">
                  <FaShoppingCart className="fs-4 text-danger" />
                  {totalItemsCarrito > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {totalItemsCarrito}
                    </span>
                  )}
                </div>
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
              {productosFiltrados.map((producto, index) => (
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
                      className="card-img-top d-flex align-items-center justify-content-center bg-light"
                      style={{ height: "200px" }}
                    >
                      <FaBoxOpen className="fs-1 text-muted" />
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
                          <span className="text-muted small">
                            Stock: {producto.stock}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <button
                          className={`btn w-100 ${producto.stock > 0 ? "btn-success" : "btn-secondary"}`}
                          disabled={producto.stock <= 0}
                          onClick={() => agregarAlCarrito(producto)}
                        >
                          <FaPlus className="me-2" />
                          {producto.stock > 0 ? "Agregar al carrito" : "Sin stock"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
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
          </main>
        </div>
      </div>

      <footer className="bg-danger text-white py-2 text-center mt-auto">
        <small>Vendismarket — Tu tienda online de confianza.</small>
      </footer>
    </div>
  );
};