import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
// ❌ ELIMINA esta línea: import { ventas } from "../data/ventas";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaReceipt, FaHistory } from "react-icons/fa";

export function HistorialVentasCajero() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState(null);

  useEffect(() => {
    const obtenerVentas = async () => {
      try {
        // Por ahora usando datos de ejemplo, luego conectar a tu API
        const ventasEjemplo = [
          {
            id: 1,
            fecha: new Date().toISOString().split('T')[0],
            cliente: "Cliente Ejemplo",
            total: 150.50,
            productos: ["Producto 1", "Producto 2"],
            estado: "Completada"
          },
          {
            id: 2,
            fecha: new Date().toISOString().split('T')[0],
            cliente: "Cliente 2",
            total: 89.75,
            productos: ["Producto 3"],
            estado: "Completada"
          }
        ];
        
        setVentas(ventasEjemplo);
        
        // TODO: Cuando tengas el endpoint de ventas, reemplazar por:
        // const response = await fetch('http://localhost:3001/api/ventas');
        // const data = await response.json();
        // setVentas(data);
        
      } catch (error) {
        console.error('Error al obtener ventas:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerVentas();
  }, []);

  const toggleExpansion = (id) => {
    setExpandido(expandido === id ? null : id);
  };

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <div className="container-fluid flex-grow-1">
          <div className="row">
            <Sidebar />
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando historial de ventas...</p>
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
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            <div className="d-flex justify-content-between align-items-center border-bottom mb-4">
              <h2 className="text-primary fw-bold mb-0">
                <FaHistory className="me-2" />
                Historial de Ventas
              </h2>
              <span className="badge bg-secondary fs-6">
                {ventas.length} ventas registradas
              </span>
            </div>

            <div className="list-group shadow-sm">
              {ventas.map((venta, index) => (
                <motion.div
                  key={venta.id}
                  className="list-group-item list-group-item-action border-0 mb-2 rounded"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className="d-flex align-items-center justify-content-between p-3 cursor-pointer"
                    onClick={() => toggleExpansion(venta.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center flex-grow-1">
                      <div className="me-3">
                        <FaReceipt className="fs-3 text-success" />
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1 fw-bold text-danger">
                          Venta #{venta.id}
                        </h5>
                        <div className="d-flex align-items-center gap-3">
                          <span className="text-muted small">
                            <strong>Fecha:</strong> {venta.fecha}
                          </span>
                          <span className="text-muted small">
                            <strong>Cliente:</strong> {venta.cliente}
                          </span>
                          <span className="badge bg-success">
                            {venta.estado}
                          </span>
                          <span className="text-primary fw-bold">
                            ${venta.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandido === venta.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {expandido === venta.id ? (
                        <FaChevronUp className="text-muted" />
                      ) : (
                        <FaChevronDown className="text-muted" />
                      )}
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {expandido === venta.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-top pt-3 px-3 pb-3">
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="bg-light rounded p-3">
                                <h6 className="text-muted mb-2">Productos vendidos</h6>
                                <ul className="list-unstyled mb-0">
                                  {venta.productos.map((producto, idx) => (
                                    <li key={idx} className="text-dark">
                                      • {producto}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="bg-light rounded p-3 text-center">
                                <h6 className="text-muted mb-1">Total de la Venta</h6>
                                <span className="fs-4 fw-bold text-success">
                                  ${venta.total.toFixed(2)}
                                </span>
                                <div className="small text-muted mt-1">
                                  Estado: {venta.estado}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {ventas.length === 0 && (
              <motion.div
                className="text-center py-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FaHistory className="fs-1 text-muted mb-3" />
                <h4 className="text-muted">No hay ventas registradas</h4>
                <p className="text-muted">
                  Las ventas aparecerán aquí una vez que se realicen
                </p>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      <footer className="bg-danger text-white py-2 text-center mt-auto">
        <small>Vendismarket — Historial de ventas del cajero.</small>
      </footer>
    </div>
  );
}