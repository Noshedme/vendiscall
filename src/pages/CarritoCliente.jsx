// src/pages/CarritoCliente.jsx
import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useCarrito } from "../hooks/useCarrito";
import { 
  FaShoppingCart, 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaShoppingBag,
  FaArrowLeft,
  FaCreditCard
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

export const CarritoCliente = () => {
  const {
    carrito,
    loading,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    obtenerSubtotal,
    obtenerIVA,
    obtenerTotal
  } = useCarrito();

  const [editandoCantidad, setEditandoCantidad] = useState(null);
  const [cantidadTemp, setCantidadTemp] = useState("");
  const navigate = useNavigate();

  const iniciarEdicionCantidad = (productoId, cantidadActual) => {
    setEditandoCantidad(productoId);
    setCantidadTemp(cantidadActual.toString());
  };

  const guardarCantidadEditada = async (productoId) => {
    const nuevaCantidad = parseInt(cantidadTemp);
    
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
      toast.error("La cantidad debe ser un número válido mayor a 0");
      return;
    }

    const success = await actualizarCantidad(productoId, nuevaCantidad);
    if (success) {
      setEditandoCantidad(null);
      setCantidadTemp("");
    }
  };

  const cancelarEdicion = () => {
    setEditandoCantidad(null);
    setCantidadTemp("");
  };

  const manejarVaciarCarrito = async () => {
    if (window.confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      await vaciarCarrito();
    }
  };

  const procederAlPago = () => {
    if (carrito.length === 0) {
      toast.warning("El carrito está vacío");
      return;
    }
    
    toast.info("Redirigiendo al formulario de pago...");
    navigate("/cliente/pago");
  };

  const continuarComprando = () => {
    navigate("/cliente/categorias");
  };

  // Función auxiliar para obtener el ID del producto
  const obtenerIdProducto = (item) => {
    return item.producto_id || item.id;
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
            <p className="mt-2">Cargando carrito...</p>
          </div>
        </div>
      </div>
    );
  }

  if (carrito.length === 0) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <div className="container-fluid flex-grow-1">
          <div className="row">
            <Sidebar />
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
              <div className="d-flex justify-content-between align-items-center border-bottom mb-4">
                <h2 className="text-primary fw-bold mb-0">
                  <FaShoppingCart className="me-2" />
                  Mi Carrito
                </h2>
              </div>

              <motion.div
                className="text-center py-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FaShoppingBag className="fs-1 text-muted mb-4" />
                <h3 className="text-muted mb-3">Tu carrito está vacío</h3>
                <p className="text-muted mb-4">
                  ¡Explora nuestros productos y encuentra lo que necesitas!
                </p>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={continuarComprando}
                >
                  <FaArrowLeft className="me-2" />
                  Continuar comprando
                </button>
              </motion.div>
            </main>
          </div>
        </div>
        <ToastContainer />
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
            <div className="d-flex justify-content-between align-items-center border-bottom mb-4">
              <h2 className="text-danger fw-bold mb-0">
                <FaShoppingCart className="me-2" />
                Mi Carrito
              </h2>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-warning"
                  onClick={continuarComprando}
                >
                  <FaArrowLeft className="me-2" />
                  Continuar comprando
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={manejarVaciarCarrito}
                >
                  <FaTrash className="me-2" />
                  Vaciar carrito
                </button>
              </div>
            </div>

            <div className="row">
              {/* Lista de productos */}
              <div className="col-lg-8">
                <div className="card shadow-sm">
                  <div className="card-header bg-danger text-white">
                    <h5 className="mb-0 text-warning">
                      Productos ({carrito.length} {carrito.length === 1 ? 'artículo' : 'artículos'})
                    </h5>
                  </div>
                  <div className="card-body p-0">
                    <AnimatePresence>
                      {carrito.map((item, index) => {
                        const productoId = obtenerIdProducto(item);
                        return (
                          <motion.div
                            key={productoId}
                            className={`p-4 ${index !== carrito.length - 1 ? 'border-bottom' : ''}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="row align-items-center">
                              <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                  <div className="me-3">
                                    <div 
                                      className="bg-light rounded d-flex align-items-center justify-content-center"
                                      style={{ width: "60px", height: "60px" }}
                                    >
                                      <FaShoppingBag className="text-danger" />
                                    </div>
                                  </div>
                                  <div>
                                    <h6 className="mb-1 fw-bold text-danger">{item.nombre}</h6>
                                    <small className="text-muted">Código: {item.codigo}</small>
                                    <br />
                                    <small className="fw-bold text-warning">
                                      ${parseFloat(item.precio).toFixed(2)} c/u
                                    </small>
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-3">
                                <div className="d-flex align-items-center justify-content-center">
                                  {editandoCantidad === productoId ? (
                                    <div className="input-group" style={{ maxWidth: "150px" }}>
                                      <input
                                        type="number"
                                        className="form-control form-control-sm text-center"
                                        value={cantidadTemp}
                                        onChange={(e) => setCantidadTemp(e.target.value)}
                                        min="1"
                                        max={item.stock}
                                        autoFocus
                                      />
                                      <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => guardarCantidadEditada(productoId)}
                                      >
                                        <FaSave />
                                      </button>
                                      <button
                                        className="btn btn-warning btn-sm"
                                        onClick={cancelarEdicion}
                                      >
                                        <FaTimes />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="d-flex align-items-center gap-2">
                                      <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => actualizarCantidad(productoId, item.cantidad - 1)}
                                      >
                                        <FaMinus />
                                      </button>
                                      <span 
                                        className="fw-bold px-3 py-1 bg-light rounded cursor-pointer"
                                        onClick={() => iniciarEdicionCantidad(productoId, item.cantidad)}
                                        title="Click para editar"
                                        style={{ cursor: "pointer", minWidth: "40px", textAlign: "center" }}
                                      >
                                        {item.cantidad}
                                      </span>
                                      <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => actualizarCantidad(productoId, item.cantidad + 1)}
                                        disabled={item.cantidad >= item.stock}
                                      >
                                        <FaPlus />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <div className="text-center mt-1">
                                  <small className="text-muted">
                                    Stock: {item.stock}
                                  </small>
                                </div>
                              </div>

                              <div className="col-md-2 text-center">
                                <div className="fw-bold text-danger fs-5">
                                  ${(item.precio * item.cantidad).toFixed(2)}
                                </div>
                              </div>

                              <div className="col-md-1 text-center">
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => eliminarDelCarrito(productoId)}
                                  title="Eliminar producto"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Resumen de compra */}
              <div className="col-lg-4">
                <motion.div
                  className="card shadow-sm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="card-header bg-warning text-dark">
                    <h5 className="mb-0">Resumen de compra</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span className="fw-bold text-danger">${obtenerSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>IVA (12%):</span>
                      <span className="fw-bold text-danger">${obtenerIVA().toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-4">
                      <span className="fs-5 fw-bold">Total:</span>
                      <span className="fs-4 fw-bold text-danger">
                        ${obtenerTotal().toFixed(2)}
                      </span>
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-danger btn-lg"
                        onClick={procederAlPago}
                      >
                        <FaCreditCard className="me-2" />
                        Proceder al pago
                      </button>
                      <button
                        className="btn btn-outline-warning"
                        onClick={continuarComprando}
                      >
                        Seguir comprando
                      </button>
                    </div>

                    <div className="mt-4 p-3 bg-light rounded">
                      <h6 className="text-muted mb-2">Información de envío:</h6>
                      <small className="text-muted">
                        📦 Envío gratis para compras superiores a $50.00
                        <br />
                        <br />
                        💳 Aceptamos múltiples formas de pago
                      </small>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <footer className="bg-danger text-white py-2 text-center mt-auto">
        <small>Vendismarket — Tu compra segura y confiable.</small>
      </footer>
    </div>
  );
};