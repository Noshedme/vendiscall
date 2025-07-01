// src/pages/DashboardAdmin.jsx
import React from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

export const DashboardAdmin = () => {
  return (
    <div>
      <Header />
      <div className="container-fluid">
        <div className="row">
          <Sidebar />

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2">Dashboard</h1>
            </div>

            <div className="row">
              {/* Card Usuarios */}
              <div className="col-sm-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Usuarios</h5>
                    <p className="card-text">Gestiona cuentas de cajeros y clientes.</p>
                    <button className="btn btn-primary">Ver Usuarios</button>
                  </div>
                </div>
              </div>

              {/* Card Productos */}
              <div className="col-sm-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Productos</h5>
                    <p className="card-text">Agrega, edita y elimina productos.</p>
                    <button className="btn btn-primary">Ver Productos</button>
                  </div>
                </div>
              </div>

              {/* Card Reportes (ejemplo) */}
              <div className="col-sm-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Reportes</h5>
                    <p className="card-text">Revisa estadísticas de ventas y usuarios.</p>
                    <button className="btn btn-primary">Ver Reportes</button>
                  </div>
                </div>
              </div>
            </div>
            
          </main>
        </div>
      </div>
    </div>
  );
};
