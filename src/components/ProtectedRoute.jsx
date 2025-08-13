// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    // Si no hay usuario logueado, redirigir al login
    return <Navigate to="/login" replace />;
  }

  // Si el usuario no tiene un rol permitido
  if (!allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  // Si pasa las validaciones, renderizar el contenido
  return children;
}
