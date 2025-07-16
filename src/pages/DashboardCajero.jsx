// src/pages/DashboardCajero.jsx
import React from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

export const DashboardCajero = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      
      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          <Sidebar />

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-3">
            {/* Header más compacto */}
            <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
              <h1 className="h2 mb-0">PANEL DE CAJERO</h1>
            </div>

            {/* Container para centrar las cards */}
            <div className="row justify-content-center g-3">
              {/* Card Caja Actual */}
              <div className="col-sm-6 col-lg-4 col-xl-3">
                <div className="card h-100 shadow-sm card-hover">
                  <div className="card-body d-flex flex-column">
                    <div className="text-center mb-3">
                      <i className="bi bi-cash-coin fs-1 text-primary"></i>
                    </div>
                    <h5 className="card-title text-center">Caja Actual</h5>
                    <p className="card-text text-center flex-grow-1">
                      Ver y gestionar la venta en curso.
                    </p>
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => navigate("/cajero/caja")}
                    >
                      Ver Caja
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Buscar Productos */}
              <div className="col-sm-6 col-lg-4 col-xl-3">
                <div className="card h-100 shadow-sm card-hover">
                  <div className="card-body d-flex flex-column">
                    <div className="text-center mb-3">
                      <i className="bi bi-search fs-1 text-primary"></i>
                    </div>
                    <h5 className="card-title text-center">Buscar Productos</h5>
                    <p className="card-text text-center flex-grow-1">
                      Explora productos por nombre o código.
                    </p>
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => navigate("/cajero/buscar")}
                    >
                      Buscar Productos
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Carrito */}
              <div className="col-sm-6 col-lg-4 col-xl-3">
                <div className="card h-100 shadow-sm card-hover">
                  <div className="card-body d-flex flex-column">
                    <div className="text-center mb-3">
                      <i className="bi bi-cart4 fs-1 text-primary"></i>
                    </div>
                    <h5 className="card-title text-center">Carrito en Curso</h5>
                    <p className="card-text text-center flex-grow-1">
                      Revisa productos añadidos a la venta.
                    </p>
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => navigate("/cajero/carrito")}
                    >
                      Ver Carrito
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Historial */}
              <div className="col-sm-6 col-lg-4 col-xl-3">
                <div className="card h-100 shadow-sm card-hover">
                  <div className="card-body d-flex flex-column">
                    <div className="text-center mb-3">
                      <i className="bi bi-clock-history fs-1 text-primary"></i>
                    </div>
                    <h5 className="card-title text-center">Historial de Ventas</h5>
                    <p className="card-text text-center flex-grow-1">
                      Consulta las ventas finalizadas.
                    </p>
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => navigate("/cajero/historial")}
                    >
                      Ver Historial
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Mi Cuenta */}
              <div className="col-sm-6 col-lg-4 col-xl-3">
                <div className="card h-100 shadow-sm card-hover">
                  <div className="card-body d-flex flex-column">
                    <div className="text-center mb-3">
                      <i className="bi bi-person-badge fs-1 text-primary"></i>
                    </div>
                    <h5 className="card-title text-center">Mi Cuenta</h5>
                    <p className="card-text text-center flex-grow-1">
                      Gestiona tus datos personales.
                    </p>
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => navigate("/cajero/cuenta")}
                    >
                      Ver Cuenta
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección adicional para llenar espacio */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Estadísticas Rápidas</h5>
                    <div className="row text-center">
                      <div className="col-md-4">
                        <div className="border-end">
                          <h3 className="text-primary">23</h3>
                          <p className="text-muted mb-0">Ventas Realizadas</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="border-end">
                          <h3 className="text-success">$1,250</h3>
                          <p className="text-muted mb-0">Ventas Hoy</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <h3 className="text-warning">15</h3>
                        <p className="text-muted mb-0">Productos en Carrito</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer más compacto */}
      <footer className="bg-danger text-white py-2 mt-auto position-relative">
        <div className="text-center px-4">
          <small>
            Vendismarket S.A.S. — Panel exclusivo para cajeros autorizados.
          </small>
        </div>
      </footer>
    </div>
  );
};