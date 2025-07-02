import logo from "../assets/logo.png";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("1234");

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = login(username, password);
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "cajero") navigate("/cajero");
      else if (user.role === "cliente") navigate("/cliente");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card login mx-auto p-4 shadow" style={{ maxWidth: "400px" }}>
        <div className="text-center mb-3">
          <img src={logo} alt="Logo tienda" style={{ maxWidth: "160px" }} />
        </div>

        {/* Título personalizado */}
        <h2 className="text-center mb-4" style={{ fontWeight: "700", fontSize: "1.8rem" }}>
          <span style={{ color: "var(--rojo)" }}>Vendis</span>
          <span style={{ color: "var(--amarillo-dark)" }}>market</span>
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};
