// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Login } from "../pages/Login";
import { DashboardAdmin } from "../pages/DashboardAdmin";
import { DashboardCajero } from "../pages/DashboardCajero";
import { DashboardCliente } from "../pages/DashboardCliente";

export const AppRoutes = () => {
  const { user } = useAuth();

  const ProtectedRoute = ({ children, role }) => {
    if (!user) return <Navigate to="/" />;
    if (user.role !== role) return <Navigate to="/" />;
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cajero"
        element={
          <ProtectedRoute role="cajero">
            <DashboardCajero />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cliente"
        element={
          <ProtectedRoute role="cliente">
            <DashboardCliente />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
