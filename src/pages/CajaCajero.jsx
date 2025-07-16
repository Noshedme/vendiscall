import React from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { FaCashRegister, FaChartPie, FaDollarSign } from "react-icons/fa";

// Datos quemados
const inicioCaja = 100;
const ventasDelDia = [
  { tipo: "Efectivo", monto: 250 },
  { tipo: "Transferencia", monto: 180 },
  { tipo: "Tarjeta", monto: 220 }
];

const totalVentas = ventasDelDia.reduce((acc, venta) => acc + venta.monto, 0);
const totalEnCaja = inicioCaja + totalVentas;

const colores = ["#2ecc71", "#3498db", "#f39c12"];

export function CajaCajero() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container-fluid flex-grow-1">
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-4">
              <h2 className="text-primary fw-bold mb-0">
                <FaCashRegister className="me-2" />
                Caja del Día
              </h2>
            </div>

            <div className="row g-4">
              {/* Gráfico */}
              <div className="col-md-6">
                <motion.div
                  className="card shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="card-header bg-light">
                    <h5 className="mb-0"><FaChartPie className="me-2 text-danger" />Resumen de ventas</h5>
                  </div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={ventasDelDia}
                          dataKey="monto"
                          nameKey="tipo"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {ventasDelDia.map((entry, index) => (
                            <Cell key={index} fill={colores[index % colores.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>

              {/* Detalle */}
              <div className="col-md-6">
                <motion.div
                  className="card shadow-sm h-100"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="card-header bg-warning">
                    <h5 className="mb-0"><FaDollarSign className="me-2" />Detalle del Día</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush mb-3">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Inicio de caja</span>
                        <strong>${inicioCaja.toFixed(2)}</strong>
                      </li>
                      {ventasDelDia.map((venta, i) => (
                        <li key={i} className="list-group-item d-flex justify-content-between">
                          <span>Total vendido ({venta.tipo})</span>
                          <strong>${venta.monto.toFixed(2)}</strong>
                        </li>
                      ))}
                      <li className="list-group-item d-flex justify-content-between bg-light">
                        <span>Total ventas</span>
                        <strong>${totalVentas.toFixed(2)}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between text-success fw-bold">
                        <span>Total en caja</span>
                        <strong>${totalEnCaja.toFixed(2)}</strong>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <footer className="bg-danger text-white py-2 text-center mt-auto">
        <small>Vendismarket — Caja del día actual.</small>
      </footer>
    </div>
  );
}
