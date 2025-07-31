// src/components/LoginForm.jsx
import logo from "../assets/logo.png";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login(email, password);
      
      if (user) {
        // Redirigir según el rol
        if (user.role === "admin") navigate("/admin");
        else if (user.role === "cajero") navigate("/cajero");
        else if (user.role === "cliente") navigate("/cliente");
      }
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card login mx-auto p-4 shadow" style={{ maxWidth: "400px" }}>
        <div className="text-center mb-3">
          <img src={logo} alt="Logo tienda" style={{ maxWidth: "160px", borderRadius: "30%"}} />
        </div>

        <h2 className="text-center mb-4" style={{ fontWeight: "700", fontSize: "1.8rem" }}>
          <span style={{ color: "var(--rojo)" }}>Vendis</span>
          <span style={{ color: "var(--amarillo-dark)" }}>market</span>
        </h2>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError("")}
            ></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email / Usuario</label>
            <input
              type="text"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu email o usuario"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
              disabled={loading}
            />
            <div className="text-end mt-1">
              <a 
                href="/recuperar" 
                className="text-decoration-none small text-danger"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Iniciando sesión...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-muted mb-0">
            ¿No tienes cuenta?{' '}
            <a 
              href="/register" 
              className="text-decoration-none fw-bold"
              style={{ color: "var(--rojo)" }}
            >
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
