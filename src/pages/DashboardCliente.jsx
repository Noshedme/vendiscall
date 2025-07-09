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
          {/* Sidebar dinámico */}
          <Sidebar />

          {/* Contenido principal */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-3">
            {/* Título */}
            <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
              <h2 className="mb-0">
                <i className="bi bi-house-door-fill me-2"></i>
                Bienvenido al portal de cliente
              </h2>
            </div>

            <div className="row g-3">
              {/* Mi Cuenta */}
              <div className="col-sm-6 col-lg-4">
                <div className="card h-100 shadow-sm card-hover">
                  <div className="card-body text-center">
                    <i className="bi bi-person-circle fs-1 text-primary mb-3"></i>
                    <h5 className="card-title">Mi Cuenta</h5>
                    <p className="card-text">
                      Ver y actualizar datos personales.
                    </p>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={() => navigate("/cliente/cuenta")}
                    >
                      Ver Cuenta
                    </button>
                  </div>
                </div>
              </div>

              {/* Categorías */}
              <div className="col-sm-6 col-lg-4">
                <div className="card h-100 shadow-sm card-hover">
                  <div className="card-body text-center">
                    <i className="bi bi-tags fs-1 text-success mb-3"></i>
                    <h5 className="card-title">Categorías</h5>
                    <p className="card-text">
                      Explora productos por categoría.
                    </p>
                    <button
                      className="btn btn-success mt-2"
                      onClick={() => navigate("/cliente/categorias")}
                    >
                      Ver Productos
                    </button>
                  </div>
                </div>
              </div>

              {/* Carrito */}
              <div className="col-sm-6 col-lg-4">
                <div className="card h-100 shadow-sm card-hover">
                  <div className="card-body text-center">
                    <i className="bi bi-cart4 fs-1 text-warning mb-3"></i>
                    <h5 className="card-title">Carrito</h5>
                    <p className="card-text">
                      Revisa tu carrito de compras.
                    </p>
                    <button
                      className="btn btn-warning mt-2"
                      onClick={() => navigate("/cliente/carrito")}
                    >
                      Ir al Carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-danger text-white py-2 mt-auto text-center">
        <small>
          Vendismarket S.A.S. — Servicio exclusivo para clientes registrados.
        </small>
      </footer>
    </div>
  );
};
