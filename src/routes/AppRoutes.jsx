import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { Login } from "../pages/Login";
import { DashboardAdmin } from "../pages/DashboardAdmin";
import { DashboardCajero } from "../pages/DashboardCajero";
import { DashboardCliente } from "../pages/DashboardCliente";

import { CuentaCliente } from "../pages/CuentaCliente";
import { CategoriasProductos } from "../pages/CategoriasProductos";
import { CarritoCliente } from "../pages/CarritoCliente";

import { Usuarios } from "../pages/Usuarios";
import { Productos } from "../pages/Productos";
import { Reportes } from "../pages/Reportes";

export const AppRoutes = () => {
  const { user } = useAuth();

  const ProtectedRoute = ({ children, role }) => {
    if (!user) return <Navigate to="/" />;
    if (user.role !== role) return <Navigate to="/" />;
    return children;
  };

  return (
    <Routes>
      {/* Página de inicio de sesión */}
      <Route path="/" element={<Login />} />

      {/* Rutas para administrador */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/usuarios"
        element={
          <ProtectedRoute role="admin">
            <Usuarios />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/productos"
        element={
          <ProtectedRoute role="admin">
            <Productos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reportes"
        element={
          <ProtectedRoute role="admin">
            <Reportes />
          </ProtectedRoute>
        }
      />

      {/* Rutas para cajero */}
      <Route
        path="/cajero"
        element={
          <ProtectedRoute role="cajero">
            <DashboardCajero />
          </ProtectedRoute>
        }
      />

      {/* Rutas para cliente */}
      <Route
        path="/cliente"
        element={
          <ProtectedRoute role="cliente">
            <DashboardCliente />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cliente/cuenta"
        element={
          <ProtectedRoute role="cliente">
            <CuentaCliente />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cliente/categorias"
        element={
          <ProtectedRoute role="cliente">
            <CategoriasProductos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cliente/carrito"
        element={
          <ProtectedRoute role="cliente">
            <CarritoCliente />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
