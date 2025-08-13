// src/components/Sidebar.jsx 
import React from "react"; 
import { NavLink } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext"; 
 
export const Sidebar = () => { 
  const { user } = useAuth(); 
 
  // Menús según role 
  const menuItems = { 
    admin: [ 
      { path: "/admin", label: "Inicio", icon: "bi-speedometer2" }, 
      { path: "/admin/usuarios", label: "Usuarios", icon: "bi-people" }, 
      { path: "/admin/productos", label: "Productos", icon: "bi-box-seam" }, 
      { path: "/admin/reportes", label: "Reportes", icon: "bi-graph-up" } 
    ], 
    cajero: [ 
      { path: "/cajero", label: "Inicio", icon: "bi-speedometer2" }, 
      { path: "/cajero/caja", label: "Caja Actual", icon: "bi-cash-coin" }, 
      { path: "/cajero/buscar", label: "Buscar Productos", icon: "bi-search" }, 
      { path: "/cajero/carrito", label: "Carrito en Curso", icon: "bi-cart" }, 
      { path: "/cajero/historial", label: "Historial de Ventas", icon: "bi-clock-history" }, 
      { path: "/cajero/cuenta", label: "Mi Cuenta", icon: "bi-person-circle" } 
    ], 
    cliente: [
      { path: "/cliente", label: "Inicio", icon: "bi-house-door" },
      { path: "/cliente/cuenta", label: "Mi Cuenta", icon: "bi-person-circle" },
      { path: "/cliente/categorias", label: "Categorías", icon: "bi-tags" },
      { path: "/cliente/carrito", label: "Carrito", icon: "bi-cart" },
      { path: "/cliente/reclamos", label: "Reclamos", icon: "bi-chat-dots" }
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