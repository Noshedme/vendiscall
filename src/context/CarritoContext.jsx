import { createContext, useContext, useState } from "react";

const CarritoContext = createContext();
export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const añadirAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        // Verificar que no supere el stock disponible
        if (existe.cantidad >= producto.stock) {
          return prev; // No añadir si ya alcanzó el límite de stock
        }
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    setCarrito((prev) => 
      prev.map((p) => 
        p.id === id ? { ...p, cantidad: nuevaCantidad } : p
      )
    );
  };

  const vaciarCarrito = () => setCarrito([]);

  const obtenerCantidadTotal = () => {
    return carrito.reduce((total, producto) => total + producto.cantidad, 0);
  };

  const obtenerTotal = () => {
    return carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  };

  const obtenerCantidadProducto = (id) => {
    const producto = carrito.find(p => p.id === id);
    return producto ? producto.cantidad : 0;
  };

  return (
    <CarritoContext.Provider
      value={{ 
        carrito, 
        añadirAlCarrito, 
        eliminarDelCarrito, 
        actualizarCantidad,
        vaciarCarrito,
        obtenerCantidadTotal,
        obtenerTotal,
        obtenerCantidadProducto
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};