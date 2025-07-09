// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Sidebar = () => {
  const { user } = useAuth();

  // Menús según role
  const menuItems = {
    admin: [
      { path: "/admin", label: "Panel", icon: "bi-speedometer2" },
      { path: "/admin/usuarios", label: "Usuarios", icon: "bi-people" },
      { path: "/admin/productos", label: "Productos", icon: "bi-box-seam" },
      { path: "/admin/reportes", label: "Reportes", icon: "bi-graph-up" }
    ],
    cajero: [
      { path: "/cajero", label: "Panel", icon: "bi-speedometer2" },
      { path: "/cajero/ventas", label: "Ventas", icon: "bi-cart-check" },
      { path: "/cajero/reportes", label: "Reportes", icon: "bi-graph-up" }
    ],
    cliente: [
      { path: "/cliente", label: "Dashboard", icon: "bi-house-door" },
      { path: "/cliente/cuenta", label: "Mi Cuenta", icon: "bi-person-circle" },
      { path: "/cliente/categorias", label: "Categorías", icon: "bi-tags" },
      { path: "/cliente/carrito", label: "Carrito", icon: "bi-cart" }
    ]
  };

  const items = menuItems[user?.role] || [];

  return (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar pt-3">
      <ul className="nav flex-column">
        {items.map((item) => (
          <li key={item.path} className="nav-item mb-2">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active fw-bold" : ""}`
              }
            >
              <i className={`bi ${item.icon}`}></i> {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
