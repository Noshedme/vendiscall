// src/hooks/useCarrito.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:3001/api';

export const useCarrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Cargar carrito al inicio
  useEffect(() => {
    if (user && user.id) {
      cargarCarritoDesdeBackend();
    }
  }, [user]);

  // Cargar carrito desde el backend
  const cargarCarritoDesdeBackend = async () => {
    if (!user || !user.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/carrito?cliente_id=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setCarrito(data.carrito);
        // También actualizar localStorage como backup
        localStorage.setItem('carrito', JSON.stringify(data.carrito));
      }
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      // Si falla, cargar desde localStorage
      cargarCarritoLocal();
    } finally {
      setLoading(false);
    }
  };

  // Cargar carrito desde localStorage (backup)
  const cargarCarritoLocal = () => {
    const carritoLocal = localStorage.getItem('carrito');
    if (carritoLocal) {
      setCarrito(JSON.parse(carritoLocal));
    }
  };

  // Sincronizar con localStorage
  const sincronizarLocalStorage = (nuevoCarrito) => {
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    setCarrito(nuevoCarrito);
  };

  // Agregar producto al carrito
  const agregarAlCarrito = async (producto) => {
    if (!user || !user.id) {
      toast.error('Debe iniciar sesión para agregar productos');
      return false;
    }

    try {
      const productoExistente = carrito.find(item => item.producto_id === producto.id);
      const nuevaCantidad = productoExistente ? productoExistente.cantidad + 1 : 1;

      // Verificar stock local primero
      if (nuevaCantidad > producto.stock) {
        toast.warning(`No hay más stock disponible de ${producto.nombre}`);
        return false;
      }

      const response = await fetch(`${API_URL}/carrito/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cliente_id: user.id,
          producto_id: producto.id,
          cantidad: nuevaCantidad
        }),
      });

      const data = await response.json();

      if (data.success) {
        await cargarCarritoDesdeBackend(); // Recargar carrito
        toast.success(`${producto.nombre} agregado al carrito`);
        return true;
      } else {
        toast.error(data.error || 'Error al agregar producto');
        return false;
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      // Fallback: agregar solo localmente
      agregarLocalmenteAlCarrito(producto);
      return false;
    }
  };

  // Agregar localmente (fallback)
  const agregarLocalmenteAlCarrito = (producto) => {
    const carritoActual = [...carrito];
    const productoExistente = carritoActual.find(item => item.id === producto.id);

    if (productoExistente) {
      if (productoExistente.cantidad < producto.stock) {
        productoExistente.cantidad += 1;
        toast.success(`${producto.nombre} agregado al carrito`);
      } else {
        toast.warning(`No hay más stock disponible de ${producto.nombre}`);
        return;
      }
    } else {
      if (producto.stock > 0) {
        carritoActual.push({
          id: producto.id,
          producto_id: producto.id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1,
          stock: producto.stock,
          categoria: producto.categoria
        });
        toast.success(`${producto.nombre} agregado al carrito`);
      } else {
        toast.error(`${producto.nombre} no tiene stock disponible`);
        return;
      }
    }

    sincronizarLocalStorage(carritoActual);
  };

  // Actualizar cantidad
  const actualizarCantidad = async (productoId, nuevaCantidad) => {
    if (!user || !user.id) return false;

    try {
      if (nuevaCantidad <= 0) {
        return await eliminarDelCarrito(productoId);
      }

      const response = await fetch(`${API_URL}/carrito/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cliente_id: user.id,
          producto_id: productoId,
          cantidad: nuevaCantidad
        }),
      });

      const data = await response.json();

      if (data.success) {
        await cargarCarritoDesdeBackend();
        toast.success('Cantidad actualizada');
        return true;
      } else {
        toast.error(data.error || 'Error al actualizar cantidad');
        return false;
      }
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      // Fallback local
      const carritoActualizado = carrito.map(item =>
        item.producto_id === productoId || item.id === productoId
          ? { ...item, cantidad: nuevaCantidad }
          : item
      );
      sincronizarLocalStorage(carritoActualizado);
      return false;
    }
  };

  // Eliminar del carrito
  const eliminarDelCarrito = async (productoId) => {
    if (!user || !user.id) return false;

    try {
      const response = await fetch(`${API_URL}/carrito/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cliente_id: user.id,
          producto_id: productoId
        }),
      });

      const data = await response.json();

      if (data.success) {
        await cargarCarritoDesdeBackend();
        toast.info('Producto eliminado del carrito');
        return true;
      } else {
        toast.error(data.error || 'Error al eliminar producto');
        return false;
      }
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      // Fallback local
      const carritoActualizado = carrito.filter(item => 
        item.producto_id !== productoId && item.id !== productoId
      );
      sincronizarLocalStorage(carritoActualizado);
      return false;
    }
  };

  // Vaciar carrito
  const vaciarCarrito = async () => {
    if (!user || !user.id) return false;

    try {
      const response = await fetch(`${API_URL}/carrito/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cliente_id: user.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCarrito([]);
        localStorage.removeItem('carrito');
        toast.info('Carrito vaciado');
        return true;
      } else {
        toast.error(data.error || 'Error al vaciar carrito');
        return false;
      }
    } catch (error) {
      console.error('Error al vaciar carrito:', error);
      // Fallback local
      setCarrito([]);
      localStorage.removeItem('carrito');
      return false;
    }
  };

  // Obtener totales
  const obtenerCantidadTotal = () => {
    return carrito.reduce((total, producto) => total + producto.cantidad, 0);
  };

  const obtenerSubtotal = () => {
    return carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  };

  const obtenerIVA = () => {
    return obtenerSubtotal() * 0.12; // 12% IVA
  };

  const obtenerTotal = () => {
    return obtenerSubtotal() + obtenerIVA();
  };

  const obtenerCantidadProducto = (productoId) => {
    const producto = carrito.find(p => p.producto_id === productoId || p.id === productoId);
    return producto ? producto.cantidad : 0;
  };

  return {
    carrito,
    loading,
    agregarAlCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    obtenerCantidadTotal,
    obtenerSubtotal,
    obtenerIVA,
    obtenerTotal,
    obtenerCantidadProducto,
    cargarCarritoDesdeBackend
  };
};