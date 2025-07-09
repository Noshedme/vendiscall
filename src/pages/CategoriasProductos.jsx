import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useCarrito } from "../context/CarritoContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaCartPlus, FaTag } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const productos = [
  { id: 1, nombre: "Aceite de Girasol", precio: 3.25, categoria: "Aceites", imagen: "https://via.placeholder.com/80" },
  { id: 2, nombre: "Arroz Integral", precio: 1.95, categoria: "Cereales", imagen: "https://via.placeholder.com/80" },
  { id: 3, nombre: "Leche Deslactosada", precio: 2.5, categoria: "Lácteos", imagen: "https://via.placeholder.com/80" },
  { id: 4, nombre: "Cerveza Artesanal", precio: 1.75, categoria: "Cervezas", imagen: "https://via.placeholder.com/80" },
  { id: 5, nombre: "Galletas Choco", precio: 0.99, categoria: "Snacks", imagen: "https://via.placeholder.com/80" },
  // ...más productos
];

const categorias = ["Todos", "Aceites", "Cereales", "Lácteos", "Cervezas", "Snacks"];

export function CategoriasProductos() {
  const { añadirAlCarrito } = useCarrito();
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");

  useEffect(() => {
    AOS.init({ duration: 600 });
  }, []);

  const handleAñadir = (producto) => {
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

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          {/* Sidebar dinámico */}
          <Sidebar />

          {/* Contenido principal */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-3">
            {/* Título */}
            <motion.h2
              className="fw-bold text-danger mb-4 d-flex align-items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FaTag className="me-2" />
              Productos disponibles
            </motion.h2>

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

            {/* Lista de productos */}
            {productosFiltrados.length > 0 ? (
              <div className="list-group">
                {productosFiltrados.map((producto) => (
                  <motion.div
                    key={producto.id}
                    className="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
                    data-aos="fade-up"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="rounded me-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover"
                        }}
                      />
                      <div>
                        <h5 className="mb-1 fw-semibold text-dark">
                          {producto.nombre}
                        </h5>
                        <p className="mb-0 text-muted">
                          <i className="bi bi-cash-coin me-1"></i>$
                          {producto.precio.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleAñadir(producto)}
                    >
                      <FaCartPlus className="me-1" /> Añadir
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="alert alert-warning text-center mt-4">
                No se encontraron productos.
              </div>
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
