import React, { useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { ventas } from "../data/ventas";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaReceipt, FaHistory } from "react-icons/fa";

export function HistorialVentasCajero() {
  const [abierto, setAbierto] = useState(null);

  const toggleVenta = (id) => {
    setAbierto(abierto === id ? null : id);
  };

  const calcularSubtotal = (productos) =>
    productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const calcularIVA = (subtotal) => subtotal * 0.12;

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container-fluid flex-grow-1">
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
              <h2 className="text-primary fw-bold mb-0">
                <FaHistory className="me-2" />
                Historial de Ventas
              </h2>
            </div>

            <div className="list-group">
              {ventas.map((venta) => {
                const subtotal = calcularSubtotal(venta.productos);
                const iva = calcularIVA(subtotal);
                const total = subtotal + iva;

                return (
                  <div
                    key={venta.id}
                    className="list-group-item list-group-item-action mb-2 shadow-sm rounded"
                  >
                    <div
                      className="d-flex justify-content-between align-items-center"
                      onClick={() => toggleVenta(venta.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div>
                        <FaReceipt className="me-2 text-warning" />
                        <strong>Venta #{venta.id}</strong> —{" "}
                        <span className="text-muted">{venta.fecha}</span>
                        <br />
                        <small className="text-secondary">
                          Cliente: {venta.cliente.nombre} ({venta.cliente.cedula})
                        </small>
                      </div>
                      <div className="text-end">
                        {abierto === venta.id ? (
                          <FaChevronUp className="text-primary" />
                        ) : (
                          <FaChevronDown className="text-muted" />
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {abierto === venta.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="mt-3">
                            <ul className="list-group">
                              {venta.productos.map((p, index) => (
                                <li
                                  key={index}
                                  className="list-group-item d-flex justify-content-between"
                                >
                                  <span>{p.nombre} (x{p.cantidad})</span>
                                  <span>${(p.precio * p.cantidad).toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-3 text-end">
                              <p className="mb-1">Subtotal: ${subtotal.toFixed(2)}</p>
                              <p className="mb-1">IVA (12%): ${iva.toFixed(2)}</p>
                              <h6>Total: ${total.toFixed(2)}</h6>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>

      <footer className="bg-danger text-white py-2 mt-auto text-center">
        <small>Vendismarket — Historial de ventas procesadas por cajero.</small>
      </footer>
    </div>
  );
}
