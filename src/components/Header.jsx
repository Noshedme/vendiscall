// src/components/Header.jsx
import React from "react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Vuelve al login
  };

  const goToDashboard = () => {
    if (!user) {
      navigate("/"); // Si no hay usuario logueado, ir al login
      return;
    }

    switch (user.role) {
      case "admin":
        navigate("/admin");
        break;
      case "cajero":
        navigate("/cajero");
        break;
      case "cliente":
        navigate("/cliente");
        break;
      default:
        navigate("/"); // Fallback
        break;
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid d-flex align-items-center">
        {/* Logo clickeable */}
        <img
          src={logo}
          alt="Logo"
          style={{
            height: "40px",
            marginRight: "10px",
            borderRadius: "30%",
            cursor: "pointer"
          }}
          onClick={goToDashboard}
        />

        {/* Nombre de la tienda clickeable */}
        <span
          className="navbar-brand mb-0 h1"
          onClick={goToDashboard}
          style={{ cursor: "pointer" }}
        >
          <span style={{ color: "#ffffff" }}>Vendis</span>
          <span style={{ color: "#ffeb3b" }}>market</span>
        </span>

        <div className="ms-auto d-flex align-items-center">
          <span className="text-white me-3">
            Bienvenid@, {user?.username}
          </span>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
};
