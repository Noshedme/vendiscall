// CategoriasProductos.jsx - Versión mejorada
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useCarrito } from "../context/CarritoContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaCartPlus, FaTag, FaMinus, FaPlus } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

export function CategoriasProductos() {
  const { añadirAlCarrito, carrito } = useCarrito();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [categorias, setCategorias] = useState(["Todos"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 600 });
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/productos");
      const data = await response.json();
      
      // Filtrar solo productos con stock > 0
      const productosConStock = data.filter(p => p.stock > 0);
      setProductos(productosConStock);
      
      // Extraer categorías únicas solo de productos con stock
      const categoriasUnicas = ["Todos", ...new Set(productosConStock.map(p => p.categoria))];
      setCategorias(categoriasUnicas);
      
    } catch (error) {
      console.error("Error al cargar productos:", error);
      toast.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const handleAñadir = (producto) => {
    // Verificar si el producto ya está en el carrito
    const productoEnCarrito = carrito.find(item => item.id === producto.id);
    const cantidadEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;
    
    // Verificar si hay suficiente stock
    if (cantidadEnCarrito >= producto.stock) {
      toast.warning(`No hay más stock disponible de "${producto.nombre}"`);
      return;
    }
    
    añadirAlCarrito(producto);
    toast.success(`"${producto.nombre}" añadido al carrito 🛒`);
  };

  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria =
      categoriaSeleccionada === "Todos" ||
      producto.categoria === categoriaSeleccionada;
    const coincideBusqueda = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  // Calcular cantidad en carrito para cada producto
  const getCantidadEnCarrito = (productoId) => {
    const item = carrito.find(p => p.id === productoId);
    return item ? item.cantidad : 0;
  };

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <div className="container-fluid flex-grow-1">
          <div className="row h-100">
            <Sidebar />
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-3">
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
        <div className="row h-100">
          <Sidebar />

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-3">
            {/* Título con contador del carrito */}
            <motion.div
              className="d-flex justify-content-between align-items-center mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="fw-bold text-danger mb-0 d-flex align-items-center">
                <FaTag className="me-2" />
                Productos disponibles
              </h2>
              <div className="badge bg-success fs-6">
                {carrito.length} productos en carrito
              </div>
            </motion.div>

            {/* Barra de búsqueda */}
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text bg-warning">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            {/* Filtros por categoría */}
            <div className="mb-4 d-flex flex-wrap gap-2">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  className={`btn btn-sm ${
                    categoriaSeleccionada === cat
                      ? "btn-danger"
                      : "btn-outline-danger"
                  }`}
                  onClick={() => setCategoriaSeleccionada(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Contador de resultados */}
            <div className="mb-3">
              <small className="text-muted">
                Mostrando {productosFiltrados.length} productos
                {categoriaSeleccionada !== "Todos" && ` en "${categoriaSeleccionada}"`}
              </small>
            </div>

            {/* Lista de productos */}
            {productosFiltrados.length > 0 ? (
              <div className="row g-3">
                {productosFiltrados.map((producto) => {
                  const cantidadEnCarrito = getCantidadEnCarrito(producto.id);
                  const stockDisponible = producto.stock - cantidadEnCarrito;
                  
                  return (
                    <div key={producto.id} className="col-md-6 col-lg-4">
                      <motion.div
                        className="card h-100 shadow-sm border-0"
                        data-aos="fade-up"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="position-relative">
                          <img
                            src={producto.imagen || "https://via.placeholder.com/300x200"}
                            alt={producto.nombre}
                            className="card-img-top"
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                          {cantidadEnCarrito > 0 && (
                            <span className="position-absolute top-0 end-0 badge bg-success m-2">
                              {cantidadEnCarrito} en carrito
                            </span>
                          )}
                        </div>
                        
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title text-dark fw-semibold">
                            {producto.nombre}
                          </h5>
                          <p className="card-text text-muted small flex-grow-1">
                            {producto.descripcion}
                          </p>
                          
                          <div className="mb-2">
                            <span className="badge bg-primary me-2">{producto.categoria}</span>
                            <span className={`badge ${stockDisponible <= 5 ? 'bg-warning' : 'bg-info'}`}>
                              Stock: {stockDisponible}
                            </span>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center mt-auto">
                            <h4 className="mb-0 text-success fw-bold">
                              ${parseFloat(producto.precio).toFixed(2)}
                            </h4>
                            <button
                              className={`btn ${stockDisponible > 0 ? 'btn-danger' : 'btn-secondary'} btn-sm`}
                              onClick={() => handleAñadir(producto)}
                              disabled={stockDisponible === 0}
                            >
                              <FaCartPlus className="me-1" />
                              {stockDisponible === 0 ? "Sin stock" : "Añadir"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                className="text-center py-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FaTag className="fs-1 text-muted mb-3" />
                <h4 className="text-muted">No se encontraron productos</h4>
                <p className="text-muted">
                  {categoriaSeleccionada !== "Todos" 
                    ? `No hay productos en la categoría "${categoriaSeleccionada}"` 
                    : "Intenta con otros términos de búsqueda"}
                </p>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-danger text-white text-center py-2 mt-auto">
        <small>
          Vendismarket S.A.S. — Av. González Suárez N32-17, Edif. Cc la Frutería Pb Local 3, Quito, Pichincha.
        </small>
      </footer>
    </div>
  );
}