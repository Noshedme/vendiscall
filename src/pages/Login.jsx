// src/pages/Login.jsx
import React, { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [mostrarContactos, setMostrarContactos] = useState(false);
  const navigate = useNavigate();

  const toggleContactos = () => {
    setMostrarContactos(!mostrarContactos);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container flex-grow-1 d-flex align-items-center justify-content-center">
        <LoginForm />
      </div>

      {/* Botón Contáctanos */}
      <div className="text-center mb-2">
        <button
          className="btn btn-outline-light text-dark me-2"
          onClick={toggleContactos}
        >
          <i className="bi bi-telephone me-2"></i> Contáctanos
        </button>
      </div>

      {/* Panel de redes sociales */}
      {mostrarContactos && (
        <div className="text-center mb-3">
          <div className="d-flex justify-content-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none text-primary fs-4"
            >
              <i className="bi bi-facebook"></i>
            </a>
            <a
              href="https://www.instagram.com/andcherrez"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none text-danger fs-4"
            >
              <i className="bi bi-instagram"></i>
            </a>
            <a
              href="https://wa.me/593958928862"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none text-success fs-4"
            >
              <i className="bi bi-whatsapp"></i>
            </a>
          </div>
        </div>
      )}

      {/* Footer fijo */}
      <footer className="bg-danger text-white py-2 mt-auto">
        <div className="text-center px-4">
          <small>
            Vendismarket S.A.S. (local) VendisCall — Av. González Suárez N32-17,
            Edif. Cc la Frutería Pb Local 3, Quito; Pichincha.
          </small>
        </div>
      </footer>
    </div>
  );
}
