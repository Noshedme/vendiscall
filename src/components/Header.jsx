import React from "react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid d-flex align-items-center">
        <img src={logo} alt="Logo" style={{ height: "40px", marginRight: "10px", borderRadius: "30%" }} />
        <span className="navbar-brand mb-0 h1">
          <span style={{ color: "var(--white)" }}>Vendis</span>
          <span style={{ color: "var(--amarillo-dark)" }}>market</span>
        </span>
        <div className="ms-auto d-flex align-items-center">
          <span className="text-white me-3">Bienvenid@, {user?.username}</span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
};
