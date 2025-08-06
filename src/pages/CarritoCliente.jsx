//CarritoCliente.jsx - Versión mejorada
import React, { useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useCarrito } from "../context/CarritoContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaTrash, FaShoppingBag, FaShoppingCart, FaMinus, FaPlus, FaCreditCard } from "react-icons/fa";

export function CarritoCliente() {
  const { carrito, eliminarDelCarrito, vaciarCarrito, actualizarCantidad } = useCarrito();
  const [procesandoPago, setProcesandoPago] = useState(false);

  const total = carrito.reduce(
    (suma, producto) => suma + producto.precio * producto.cantidad,
    0
  );

  const handleEliminar = (id) => {
    eliminarDelCarrito(id);
    toast.info("Producto eliminado del carrito 🗑️");
  };

  const handleVaciar = () => {
    if (window.confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      vaciarCarrito();
      toast.warn("Carrito vaciado 🛒");
    }
  };

  const handleCantidadChange = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    // Verificar stock disponible
    const producto = carrito.find(item => item.id === id);
    if (nuevaCantidad > producto.stock) {
      toast.warning(`Solo hay ${producto.stock} unidades disponibles`);
      return;
    }
    
    actualizarCantidad(id, nuevaCantidad);
  };

  const handleFinalizarCompra = async () => {
    if (carrito.length === 0) {
      toast.warning("Tu carrito está vacío");
      return;
    }

    setProcesandoPago(true);
    
    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí podrías agregar la lógica para:
      // 1. Crear la orden en la base de datos
      // 2. Actualizar el stock de productos
      // 3. Procesar el pago
      
      toast.success("¡Compra realizada con éxito! 🎉");
      vaciarCarrito();
    } catch (error) {
      toast.error("Error al procesar la compra");
    } finally {
      setProcesandoPago(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          <Sidebar />

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-3">
            {/* Título */}
            <motion.div
              className="d-flex justify-content-between align-items-center mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="fw-bold text-danger mb-0 d-flex align-items-center">
                <FaShoppingBag className="me-2" />
                Mi Carrito
              </h2>
              <span className="badge bg-primary fs-6">
                {carrito.length} productos
              </span>
            </motion.div>

            {/* Lista de productos */}
            {carrito.length === 0 ? (
              <motion.div
                className="text-center py-5 text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <i className="bi bi-cart-x display-1 mb-3" />
                <h4>Tu carrito está vacío</h4>
                <p className="lead">¡Agrega algunos productos para comenzar!</p>
                <a href="/cliente/categorias" className="btn btn-danger">
                  Ver productos
                </a>
              </motion.div>
            ) : (
              <>
                <div className="row">
                  <div className="col-lg-8">
                    <div className="card shadow-sm border-0 mb-4">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">Productos en tu carrito</h5>
                      </div>
                      <div className="card-body p-0">
                        <AnimatePresence>
                          {carrito.map((item, index) => (
                            <motion.div
                              key={item.id}
                              className={`p-4 ${index !== carrito.length - 1 ? 'border-bottom' : ''}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="row align-items-center">
                                {/* Imagen del producto */}
                                <div className="col-md-2">
                                  <img
                                    src={item.imagen || "https://via.placeholder.com/80"}
                                    alt={item.nombre}
                                    className="img-fluid rounded"
                                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                  />
                                </div>

                                {/* Información del producto */}
                                <div className="col-md-4">
                                  <h6 className="mb-1 fw-semibold">{item.nombre}</h6>
                                  <small className="text-muted">{item.descripcion}</small>
                                  <div className="mt-1">
                                    <span className="badge bg-secondary">{item.categoria}</span>
                                  </div>
                                </div>

                                {/* Controles de cantidad */}
                                <div className="col-md-3">
                                  <div className="d-flex align-items-center justify-content-center">
                                    <button
                                      className="btn btn-outline-secondary btn-sm"
                                      onClick={() => handleCantidadChange(item.id, item.cantidad - 1)}
                                      disabled={item.cantidad <= 1}
                                    >
                                      <FaMinus size={12} />
                                    </button>
                                    <span className="mx-3 fw-bold">{item.cantidad}</span>
                                    <button
                                      className="btn btn-outline-secondary btn-sm"
                                      onClick={() => handleCantidadChange(item.id, item.cantidad + 1)}
                                      disabled={item.cantidad >= item.stock}
                                    >
                                      <FaPlus size={12} />
                                    </button>
                                  </div>
                                  <small className="text-muted d-block text-center mt-1">
                                    Stock: {item.stock}
                                  </small>
                                </div>

                                {/* Precio */}
                                <div className="col-md-2 text-center">
                                  <div className="fw-bold text-success">
                                    ${(item.precio * item.cantidad).toFixed(2)}
                                  </div>
                                  <small className="text-muted">
                                    ${item.precio.toFixed(2)} c/u
                                  </small>
                                </div>

                                {/* Botón eliminar */}
                                <div className="col-md-1 text-center">
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleEliminar(item.id)}
                                    title="Eliminar producto"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Resumen del pedido */}
                  <div className="col-lg-4">
                    <div className="card shadow-sm border-0 sticky-top" style={{ top: '1rem' }}>
                      <div className="card-header bg-danger text-white">
                        <h5 className="mb-0">Resumen del pedido</h5>
                      </div>
                      <div className="card-body">
                        {/* Desglose de precios */}
                        <div className="mb-3">
                          {carrito.map((item) => (
                            <div key={item.id} className="d-flex justify-content-between mb-1">
                              <span className="text-muted small">
                                {item.nombre} x{item.cantidad}
                              </span>
                              <span className="small">
                                ${(item.precio * item.cantidad).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <hr />

                        {/* Total */}
                        <div className="d-flex justify-content-between mb-3">
                          <h5 className="fw-bold">Total:</h5>
                          <h5 className="fw-bold text-success">${total.toFixed(2)}</h5>
                        </div>

                        {/* Botones de acción */}
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-success btn-lg"
                            onClick={handleFinalizarCompra}
                            disabled={procesandoPago}
                          >
                            {procesandoPago ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Procesando...
                              </>
                            ) : (
                              <>
                                <FaCreditCard className="me-2" />
                                Finalizar compra
                              </>
                            )}
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={handleVaciar}
                            disabled={procesandoPago}
                          >
                            Vaciar carrito
                          </button>
                        </div>

                        {/* Información adicional */}
                        <div className="mt-3 p-3 bg-light rounded">
                          <small className="text-muted">
                            <strong>📦 Envío gratis</strong> en compras mayores a $50<br />
                            <strong>🔒 Pago seguro</strong> con encriptación SSL<br />
                            <strong>↩️ 30 días</strong> de garantía
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}