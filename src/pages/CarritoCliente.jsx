import React from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useCarrito } from "../context/CarritoContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaTrash, FaShoppingBag, FaShoppingCart } from "react-icons/fa";

export function CarritoCliente() {
  const { carrito, eliminarDelCarrito, vaciarCarrito } = useCarrito();

  const total = carrito.reduce(
    (suma, producto) => suma + producto.precio * producto.cantidad,
    0
  );

  const handleEliminar = (id) => {
    eliminarDelCarrito(id);
    toast.info("Producto eliminado del carrito 🗑️");
  };

  const handleVaciar = () => {
    vaciarCarrito();
    toast.warn("Carrito vaciado 🛒");
  };

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
              <FaShoppingBag className="me-2" />
              Mi Carrito
            </motion.h2>

            {/* Lista de productos */}
            {carrito.length === 0 ? (
              <motion.div
                className="text-center py-5 text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <i className="bi bi-cart-x display-1 mb-3" />
                <p className="lead">Tu carrito está vacío</p>
              </motion.div>
            ) : (
              <>
                <div className="list-group mb-4">
                  {carrito.map((item) => (
                    <motion.div
                      key={item.id}
                      className="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      data-aos="fade-up"
                    >
                      <div className="d-flex align-items-center">
                        {/* Imagen */}
                        <img
                          src={item.imagen || "https://via.placeholder.com/60"}
                          alt={item.nombre}
                          className="rounded me-3"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover"
                          }}
                        />
                        {/* Info */}
                        <div>
                          <h5 className="mb-1 fw-semibold text-dark">
                            {item.nombre}
                          </h5>
                          <p className="mb-0 text-muted">
                            ${item.precio.toFixed(2)} x {item.cantidad} ={" "}
                            <span className="fw-bold text-success">
                              ${(item.precio * item.cantidad).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </div>
                      {/* Botón eliminar */}
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleEliminar(item.id)}
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Total y acciones */}
                <div className="card shadow-sm border-0">
                  <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <h4 className="mb-3 mb-md-0 text-danger fw-bold">
                      Total:{" "}
                      <span className="text-success">${total.toFixed(2)}</span>
                    </h4>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={handleVaciar}
                      >
                        <i className="bi bi-trash3 me-1"></i> Vaciar carrito
                      </button>
                      <button className="btn btn-danger">
                        <FaShoppingCart className="me-1" /> Finalizar compra
                      </button>
                    </div>
                  </div>
                </div>
              </>
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
