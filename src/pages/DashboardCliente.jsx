// src/pages/DashboardCliente.jsx
import React from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

export const DashboardCliente = () => {
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
              <h1 className="h2 mb-0">PANEL DE CLIENTE</h1>
            </div>

            {/* Container para centrar las cards */}
            <div className="row justify-content-center g-3">
              {/* Card Mi Cuenta */}
              <div className="col-sm-6 col-lg-4 col-xl-3">
                <div className="card h-100 shadow-sm card-hover">
                  <div className="card-body d-flex flex-column">
                    <div className="text-center mb-3">
                      <i className="bi bi-person-circle fs-1 text-primary"></i>
                    </div>
                    <h5 className="card-title text-center">Mi Cuenta</h5>
                    <p className="card-text text-center flex-grow-1">
                      Ver y actualizar datos personales.
                    </p>
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => navigate("/cliente/cuenta")}
                    >
                      Ver Cuenta
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Categorías */}
              <div className="col-sm-6 col-lg-4 col-xl-3">
                <div className="card h-100 shadow-sm card-hover">
                  <div className="card-body d-flex flex-column">
                    <div className="text-center mb-3">
                      <i className="bi bi-tags fs-1 text-primary"></i>
                    </div>
                    <h5 className="card-title text-center">Categorías</h5>
                    <p className="card-text text-center flex-grow-1">
                      Explora productos por categoría.
                    </p>
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => navigate("/cliente/categorias")}
                    >
                      Ver Productos
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
                    <h5 className="card-title text-center">Carrito</h5>
                    <p className="card-text text-center flex-grow-1">
                      Revisa tu carrito de compras.
                    </p>
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => navigate("/cliente/carrito")}
                    >
                      Ir al Carrito
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Pedidos */}
              <div className="col-sm-6 col-lg-4 col-xl-3">
                <div className="card h-100 shadow-sm card-hover">
                  <div className="card-body d-flex flex-column">
                    <div className="text-center mb-3">
                      <i className="bi bi-bag-check fs-1 text-primary"></i>
                    </div>
                    <h5 className="card-title text-center">Mis Pedidos</h5>
                    <p className="card-text text-center flex-grow-1">
                      Historial de pedidos realizados.
                    </p>
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => navigate("/cliente/pedidos")}
                    >
                      Ver Pedidos
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
                    <h5 className="card-title">Resumen de mi Cuenta</h5>
                    <div className="row text-center">
                      <div className="col-md-4">
                        <div className="border-end">
                          <h3 className="text-primary">8</h3>
                          <p className="text-muted mb-0">Productos en Carrito</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="border-end">
                          <h3 className="text-success">15</h3>
                          <p className="text-muted mb-0">Pedidos Realizados</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <h3 className="text-warning">$4,250</h3>
                        <p className="text-muted mb-0">Total Compras</p>
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
            Vendismarket S.A.S. — Servicio exclusivo para clientes registrados.
          </small>
        </div>
      </footer>
    </div>
  );
};