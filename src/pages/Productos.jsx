// src/pages/Productos.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoActual, setProductoActual] = useState({
    id: null,
    codigo: "",
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/productos");
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      toast.error("Error al cargar productos");
    }
  };

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      return (
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.codigo.toLowerCase().includes(busqueda.toLowerCase())
      );
    });
  }, [busqueda, productos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductoActual({ ...productoActual, [name]: value });
  };

 const handleGuardarProducto = async () => {
  try {
    const datosFormateados = {
      ...productoActual,
      precio: parseFloat(productoActual.precio),
      stock: parseInt(productoActual.stock),
    };

    const url = modoEdicion
      ? `http://localhost:3001/api/productos/${productoActual.id}`
      : "http://localhost:3001/api/productos";
    const metodo = modoEdicion ? "PUT" : "POST";

    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosFormateados),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Error al guardar");

    // Actualizar productos en lista
    if (modoEdicion) {
      setProductos((prev) => prev.map((p) => (p.id === data.id ? data : p)));
      toast.success("Producto actualizado");
    } else {
      setProductos((prev) => [...prev, data]);
      toast.success("Producto creado");
    }

    // Reset
    setProductoActual({
      id: null,
      codigo: "",
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      categoria: "",
    });
    setModoEdicion(false);
  } catch (error) {
    console.error("Error al guardar producto:", error);
    toast.error(`Error al guardar producto: ${error.message}`);
  }
};

  const handleEliminar = async (id) => {
    if (confirm("¿Eliminar este producto?")) {
      try {
        const res = await fetch(`http://localhost:3001/api/productos/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error();
        setProductos((prev) => prev.filter((p) => p.id !== id));
        toast.info("Producto eliminado");
      } catch {
        toast.error("Error al eliminar");
      }
    }
  };

  const iniciarEdicion = (producto) => {
    setProductoActual(producto);
    setModoEdicion(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <ToastContainer />
      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-3">
            <motion.h1
              className="h2 text-danger fw-bold mb-4"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <i className="bi bi-box-seam me-2"></i>Gestión de Productos
            </motion.h1>

            {/* Formulario */}
            <motion.div
              className="card mb-4 p-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h5 className="text-primary fw-bold">
                {modoEdicion ? "Editar Producto" : "Nuevo Producto"}
              </h5>
              <div className="row g-2">
                {[
                  ["codigo", "Código"],
                  ["nombre", "Nombre"],
                  ["descripcion", "Descripción"],
                  ["precio", "Precio"],
                  ["stock", "Stock"],
                  ["categoria", "Categoría"],
                ].map(([name, placeholder]) => (
                  <div className="col-md-2" key={name}>
                    <input
                      className="form-control"
                      name={name}
                      placeholder={placeholder}
                      value={productoActual[name]}
                      onChange={handleInputChange}
                    />
                  </div>
                ))}
                <div className="col-md-2">
                  <button
                    className="btn btn-success w-100"
                    onClick={handleGuardarProducto}
                  >
                    {modoEdicion ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Tabla */}
            <div className="card shadow mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="m-0 fw-bold text-primary">
                  Inventario ({productosFiltrados.length} productos)
                </h6>
                <input
                  type="text"
                  className="form-control form-control-sm w-25"
                  placeholder="Buscar..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Categoría</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosFiltrados.map((producto, index) => (
                      <tr key={producto.id}>
                        <td>{index + 1}</td>
                        <td>{producto.codigo}</td>
                        <td>{producto.nombre}</td>
                        <td>{producto.descripcion}</td>
                        <td>${parseFloat(producto.precio).toFixed(2)}</td>
                        <td>{producto.stock}</td>
                        <td>{producto.categoria}</td>
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => iniciarEdicion(producto)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleEliminar(producto.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
