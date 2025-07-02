import React from "react";
import { NavLink } from "react-router-dom";

export const Sidebar = () => {
  return (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar pt-3">
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <NavLink to="/admin" className="nav-link">
            <i className="bi bi-speedometer2"></i> Panel
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/admin/usuarios" className="nav-link">
            <i className="bi bi-people"></i> Usuarios
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/admin/productos" className="nav-link">
            <i className="bi bi-box-seam"></i> Productos
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/admin/reportes" className="nav-link">
            <i className="bi bi-graph-up"></i> Reportes
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
