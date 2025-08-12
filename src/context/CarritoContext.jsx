// src/context/CarritoContext.jsx
import { createContext, useContext } from "react";
import { useCarrito as useCarritoHook } from "../hooks/useCarrito";

const CarritoContext = createContext();

export const useCarritoContext = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarritoContext debe ser usado dentro de CarritoProvider');
  }
  return context;
};

// Mantener compatibilidad con el nombre anterior
export const useCarrito = useCarritoContext;

export const CarritoProvider = ({ children }) => {
  const carritoData = useCarritoHook();

  return (
    <CarritoContext.Provider value={carritoData}>
      {children}
    </CarritoContext.Provider>
  );
};