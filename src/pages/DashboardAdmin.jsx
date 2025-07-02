import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

export const DashboardAdmin = () => {
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
              <h1 className="h2 mb-0">PANEL DE ADMINISTRADOR</h1>
            </div>

            {/* Container para centrar las cards */}
            <div className="row justify-content-center g-3">
              {/* Card Usuarios */}
              <div className="col-sm-6 col-lg-4 col-xl-3">
                <div className="card h-100 shadow-sm card-hover">
                  <div className="card-body d-flex flex-column">
                    <div className="text-center mb-3">
                      <i className="bi bi-people fs-1 text-primary"></i>
                    </div>
                    <h5 className="card-title text-center">Usuarios</h5>
                    <p className="card-text text-center flex-grow-1">
                      Gestiona cuentas de cajeros y clientes.
                    </p>
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => navigate("/admin/usuarios")}
                    >
                      Ver Usuarios
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Productos */}
              <div className="col-sm-6 col-lg-4 col-xl-3">
                <div className="card h-100 shadow-sm card-hover">
                  <div className="card-body d-flex flex-column">
                    <div className="text-center mb-3">
                      <i className="bi bi-box-seam fs-1 text-primary"></i>
                    </div>
                    <h5 className="card-title text-center">Productos</h5>
                    <p className="card-text text-center flex-grow-1">
                      Agrega, edita y elimina productos.
                    </p>
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => navigate("/admin/productos")}
                    >
                      Ver Productos
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Reportes */}
              <div className="col-sm-6 col-lg-4 col-xl-3">
                <div className="card h-100 shadow-sm card-hover">
                  <div className="card-body d-flex flex-column">
                    <div className="text-center mb-3">
                      <i className="bi bi-graph-up fs-1 text-primary"></i>
                    </div>
                    <h5 className="card-title text-center">Reportes</h5>
                    <p className="card-text text-center flex-grow-1">
                      Revisa estadísticas de ventas y usuarios.
                    </p>
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => navigate("/admin/reportes")}
                    >
                      Ver Reportes
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
                          <h3 className="text-primary">150</h3>
                          <p className="text-muted mb-0">Usuarios Registrados</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="border-end">
                          <h3 className="text-success">89</h3>
                          <p className="text-muted mb-0">Pedidos Realizados</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <h3 className="text-warning">$2,340</h3>
                        <p className="text-muted mb-0">Ventas Hoy</p>
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
            Vendismarket S.A.S. (local) VendisCall — Av. González Suárez N32-17, 
            Edif. Cc la Frutería Pb Local 3, Quito; Pichincha.
          </small>
        </div>
      </footer>
    </div>
  );
};