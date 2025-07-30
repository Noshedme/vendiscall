// src/pages/Productos.jsx
import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { FaBoxOpen, FaSearch, FaPlus, FaChevronDown, FaChevronUp, FaPen, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [expandido, setExpandido] = useState(null);
  const [productoActual, setProductoActual] = useState({
    id: null,
    codigo: "",
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
  });

  useEffect(() => {
    AOS.init({ duration: 500 });
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/productos");
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      toast.error("Error al cargar productos");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductoActual({ ...productoActual, [name]: value });
  };

  const handleGuardarProducto = async () => {
    try {
      const { codigo, nombre, descripcion, precio, stock, categoria } = productoActual;

      if (!codigo || !nombre || !descripcion || !precio || !stock || !categoria) {
        toast.error("Por favor completa todos los campos");
        return;
      }

      const precioNum = parseFloat(precio);
      const stockNum = parseInt(stock);

      if (isNaN(precioNum) || isNaN(stockNum)) {
        toast.error("Precio y stock deben ser valores numéricos");
        return;
      }

      const datosFormateados = {
        ...productoActual,
        precio: precioNum,
        stock: stockNum,
      };

      const url = modoEdicion
        ? `http://localhost:3001/api/productos/${productoActual.id}`
        : "http://localhost:3001/api/productos";

      const metodo = modoEdicion ? "PUT" : "POST";

      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosFormateados),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al guardar");

      toast.success(modoEdicion ? "Producto actualizado" : "Producto creado");
      await cargarProductos();
      setBusqueda("");
      setProductoActual({
        id: null,
        codigo: "",
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria: "",
      });
      setModoEdicion(false);
    } catch (error) {
      toast.error(`Error al guardar producto: ${error.message}`);
    }
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Eliminar este producto?")) {
      try {
        const res = await fetch(`http://localhost:3001/api/productos/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error();
        setProductos((prev) => prev.filter((p) => p.id !== id));
        toast.info("Producto eliminado");
      } catch {
        toast.error("Error al eliminar");
      }
    }
  };

  const iniciarEdicion = (producto) => {
    setProductoActual(producto);
    setModoEdicion(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleExpansion = (id) => {
    setExpandido(expandido === id ? null : id);
  };

  const filtrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const getStockColor = (stock) => {
    if (stock <= 5) return "text-danger";
    if (stock <= 20) return "text-warning";
    return "text-success";
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <ToastContainer />
      <div className="container-fluid flex-grow-1">
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            <div className="d-flex justify-content-between align-items-center border-bottom mb-4">
              <h2 className="text-danger fw-bold mb-0">
                <FaBoxOpen className="me-2" />
                Productos
              </h2>
              <span className="badge bg-secondary fs-6">
                {filtrados.length} encontrados
              </span>
            </div>

            {/* Formulario compacto */}
            <div className="row g-2 mb-4 align-items-end">
              {[
                ["codigo", "Código"],
                ["nombre", "Nombre"],
                ["descripcion", "Descripción"],
                ["precio", "Precio"],
                ["stock", "Stock"],
                ["categoria", "Categoría"],
              ].map(([name, placeholder]) => (
                <div className="col-md-2" key={name}>
                  <input
                    className="form-control"
                    name={name}
                    placeholder={placeholder}
                    value={productoActual[name]}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
              <div className="col-md-2">
                <button
                  className="btn btn-success w-100"
                  onClick={handleGuardarProducto}
                >
                  {modoEdicion ? "Actualizar" : "Crear"}
                </button>
              </div>
            </div>

            {/* Buscador */}
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

            {/* Lista de productos */}
            <div className="list-group shadow-sm">
              {filtrados.map((producto, index) => (
                <motion.div
                  key={producto.id}
                  className="list-group-item list-group-item-action border-0 mb-2 rounded"
                  data-aos="fade-up"
                >
                  <div
                    className="d-flex align-items-center justify-content-between p-3"
                    onClick={() => toggleExpansion(producto.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center flex-grow-1">
                      <div className="me-3">
                        <FaBoxOpen className="fs-3 text-warning" />
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1 fw-bold text-danger">{producto.nombre}</h5>
                        <div className="d-flex align-items-center gap-3">
                          <span className="text-muted small">
                            <strong>Código:</strong> {producto.codigo}
                          </span>
                          <span className={`badge ${getStockColor(producto.stock)}`}>
                            Stock: {producto.stock}
                          </span>
                          <span className="text-primary fw-bold">
                            ${parseFloat(producto.precio).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-warning btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          iniciarEdicion(producto);
                        }}
                      >
                        <FaPen />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEliminar(producto.id);
                        }}
                      >
                        <FaTrash />
                      </button>
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
                        className="overflow-hidden border-top pt-3 px-3 pb-3"
                      >
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
                              <h6 className="text-muted mb-1">Descripción</h6>
                              <p className="text-muted mb-0">{producto.descripcion}</p>
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
    </div>
  );
};
