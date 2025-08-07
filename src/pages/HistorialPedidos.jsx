import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { motion } from "framer-motion";
import { FaShoppingBag, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

export function HistorialPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Usuario logueado desde localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    async function fetchPedidos() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/api/pedidos?usuario_id=${user.id}`);
        const data = await res.json();
        setPedidos(data.pedidos || []);
      } catch (e) {
        setPedidos([]);
      }
      setLoading(false);
    }
    fetchPedidos();
  }, [user.id]);

  const statusIcon = (estado) => {
    if (estado === "entregado")
      return <FaCheckCircle className="text-success me-1" />;
    if (estado === "cancelado")
      return <FaTimesCircle className="text-danger me-1" />;
    return <FaClock className="text-warning me-1" />;
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container-fluid flex-grow-1">
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            <div className="d-flex align-items-center mb-4">
              <FaShoppingBag className="fs-3 text-danger me-2" />
              <h2 className="mb-0 fw-bold text-danger" style={{ fontSize: "1.5rem" }}>
                Historial de Pedidos
              </h2>
            </div>
            {loading ? (
              <div className="text-center py-5">
                <span className="spinner-border text-warning" />
              </div>
            ) : pedidos.length === 0 ? (
              <div className="alert alert-warning text-center">
                No tienes pedidos registrados.
              </div>
            ) : (
              <motion.div
                className="row g-3"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } }
                }}
              >
                {pedidos.map((pedido) => (
                  <motion.div
                    className="col-12"
                    key={pedido.id}
                    variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  >
                    <div className="card shadow-sm border-0 rounded-3">
                      <div className="card-body py-3 px-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <span className="badge bg-danger me-2">#{pedido.id}</span>
                            <span className="fw-bold">{new Date(pedido.fecha).toLocaleDateString()}</span>
                          </div>
                          <span>
                            {statusIcon(pedido.estado)}
                            <span className="fw-semibold text-capitalize">{pedido.estado}</span>
                          </span>
                        </div>
                        <div className="mb-2">
                          <span className="text-muted small">Total:</span>{" "}
                          <span className="fw-bold text-success">${pedido.total?.toFixed(2)}</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-muted small">Entrega:</span>{" "}
                          <span className="fw-semibold">{pedido.entrega === "domicilio" ? "Domicilio" : "Tienda"}</span>
                        </div>
                        <div>
                          <span className="text-muted small">Productos:</span>
                          <ul className="mb-0 small">
                            {pedido.productos?.map((prod, idx) => (
                              <li key={idx}>
                                {prod.nombre} <span className="text-muted">x{prod.cantidad}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </main>
        </div>
      </div>
      <footer className="bg-danger text-white py-2 text-center mt-auto">
        <small>Vendismarket — Compra segura garantizada.</small>
      </footer>
      <style>{`
        .card {
          border-radius: 1rem !important;
        }
        .badge.bg-danger {
          background: #e63946 !important;
        }
      `}</style>
    </div>
  );
}
