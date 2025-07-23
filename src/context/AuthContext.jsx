// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Login conectado al backend
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          contrasena: password
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        
        // Mapear rol_id a string para compatibilidad con tu sistema de rutas
        let roleString;
        switch(userData.rol_id) {
          case 1:
            roleString = "admin";
            break;
          case 2:
            roleString = "cajero";
            break;
          case 3:
            roleString = "cliente";
            break;
          default:
            roleString = "cliente";
        }

        const userWithRole = {
          ...userData,
          role: roleString,
          username: userData.email
        };

        setUser(userWithRole);
        
        // Guardar en localStorage para persistencia
        localStorage.setItem("user", JSON.stringify(userWithRole));
        
        return userWithRole;
      } else {
        const error = await response.json();
        throw new Error(error.error || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Registro conectado al backend
  const register = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        const error = await response.json();
        throw new Error(error.message || "Error al registrar");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Verificar si hay usuario guardado al cargar la app
  const checkAuth = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading, 
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);