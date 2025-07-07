// src/pages/Productos.jsx
import React, { useState, useMemo } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

// Productos de prueba con imagen
const productosData = [
  {
    id: 1,
    codigo: "7894561230123",
    nombre: "Aceite de Girasol",
    precio: 3.25,
    stock: 45,
    categoria: "Despensa",
    imagen: "bi-bag-fill",
    estado: "disponible"
  },
  {
    id: 2,
    codigo: "1234567890456",
    nombre: "Leche Entera",
    precio: 1.85,
    stock: 120,
    categoria: "Lácteos",
    imagen: "bi-cart3",
    estado: "disponible"
  },
  {
    id: 3,
    codigo: "9876543210789",
    nombre: "Arroz Blanco",
    precio: 2.10,
    stock: 80,
    categoria: "Granos",
    imagen: "bi-box2-fill",
    estado: "disponible"
  },
  {
    id: 4,
    codigo: "5678901234567",
    nombre: "Pan Integral",
    precio: 2.50,
    stock: 25,
    categoria: "Panadería",
    imagen: "bi-basket-fill",
    estado: "disponible"
  },
  {
    id: 5,
    codigo: "3456789012345",
    nombre: "Jabón Líquido",
    precio: 4.75,
    stock: 8,
    categoria: "Limpieza",
    imagen: "bi-droplet-fill",
    estado: "stock_bajo"
  },
  {
    id: 6,
    codigo: "2345678901234",
    nombre: "Yogurt Natural",
    precio: 1.20,
    stock: 0,
    categoria: "Lácteos",
    imagen: "bi-cup-straw",
    estado: "agotado"
  }
];

export const Productos = () => {
  const [productos, setProductos] = useState(productosData);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const categorias = [...new Set(productos.map(p => p.categoria))];

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const matchBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          producto.codigo.toLowerCase().includes(busqueda.toLowerCase());
      const matchCategoria = filtroCategoria === "" || producto.categoria === filtroCategoria;
      const matchEstado = filtroEstado === "" || producto.estado === filtroEstado;
      
      return matchBusqueda && matchCategoria && matchEstado;
    });
  }, [busqueda, productos, filtroCategoria, filtroEstado]);

  const handleEliminar = (id) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      setProductos(productos.filter((p) => p.id !== id));
    }
  };

  const getEstadoBadge = (estado, stock) => {
    if (estado === "agotado" || stock === 0) {
      return <span className="badge bg-danger">Agotado</span>;
    }
    if (estado === "stock_bajo" || stock < 10) {
      return <span className="badge bg-warning">Stock Bajo</span>;
    }
    return <span className="badge bg-success">Disponible</span>;
  };

  const getStockColor = (stock) => {
    if (stock === 0) return "text-danger";
    if (stock < 10) return "text-warning";
    return "text-success";
  };

  // Estadísticas rápidas
  const totalProductos = productos.length;
  const productosDisponibles = productos.filter(p => p.stock > 0).length;
  const productosAgotados = productos.filter(p => p.stock === 0).length;
  const stockBajo = productos.filter(p => p.stock > 0 && p.stock < 10).length;
  const valorInventario = productos.reduce((acc, p) => acc + (p.precio * p.stock), 0);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          <Sidebar />

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-3">
            {/* Header */}
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2 mb-0 text-danger fw-bold">
                <i className="bi bi-box-seam me-2"></i>
                Gestión de Productos
              </h1>
              <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group me-2">
                  <button className="btn btn-sm btn-outline-secondary">
                    <i className="bi bi-download me-1"></i>
                    Exportar
                  </button>
                  <button className="btn btn-sm btn-outline-secondary">
                    <i className="bi bi-upload me-1"></i>
                    Importar
                  </button>
                </div>
                <button className="btn btn-primary">
                  <i className="bi bi-plus-circle me-1"></i>
                  Nuevo Producto
                </button>
              </div>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="row mb-4">
              <div className="col-xl-3 col-md-6 mb-3">
                <div className="card border-left-primary shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          Total Productos
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">{totalProductos}</div>
                      </div>
                      <div className="col-auto">
                        <i className="bi bi-box-seam fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6 mb-3">
                <div className="card border-left-success shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                          Disponibles
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">{productosDisponibles}</div>
                      </div>
                      <div className="col-auto">
                        <i className="bi bi-check-circle fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6 mb-3">
                <div className="card border-left-warning shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                          Stock Bajo
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">{stockBajo}</div>
                      </div>
                      <div className="col-auto">
                        <i className="bi bi-exclamation-triangle fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6 mb-3">
                <div className="card border-left-info shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                          Valor Inventario
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">${valorInventario.toFixed(2)}</div>
                      </div>
                      <div className="col-auto">
                        <i className="bi bi-currency-dollar fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros */}
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                  <i className="bi bi-funnel me-2"></i>
                  Filtros de Búsqueda
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Buscar Producto</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nombre o código..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Categoría</label>
                    <select
                      className="form-select"
                      value={filtroCategoria}
                      onChange={(e) => setFiltroCategoria(e.target.value)}
                    >
                      <option value="">Todas las categorías</option>
                      {categorias.map(categoria => (
                        <option key={categoria} value={categoria}>{categoria}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Estado</label>
                    <select
                      className="form-select"
                      value={filtroEstado}
                      onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                      <option value="">Todos los estados</option>
                      <option value="disponible">Disponible</option>
                      <option value="stock_bajo">Stock Bajo</option>
                      <option value="agotado">Agotado</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de productos */}
            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">
                  Inventario ({productosFiltrados.length} productos)
                </h6>
                <div className="dropdown no-arrow">
                  <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown">
                    <i className="bi bi-three-dots-vertical text-gray-400"></i>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right shadow">
                    <div className="dropdown-header">Acciones:</div>
                    <a className="dropdown-item" href="#">Exportar todo</a>
                    <a className="dropdown-item" href="#">Importar productos</a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="#">Configuración</a>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th width="5%">#</th>
                        <th width="8%">Imagen</th>
                        <th width="20%">Producto</th>
                        <th width="15%">Categoría</th>
                        <th width="15%">Código</th>
                        <th width="10%">Precio</th>
                        <th width="10%">Stock</th>
                        <th width="10%">Estado</th>
                        <th width="12%">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosFiltrados.map((producto, index) => (
                        <tr key={producto.id}>
                          <td className="fw-bold text-muted">{index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center bg-light rounded" style={{width: "45px", height: "45px"}}>
                              <i className={`bi ${producto.imagen} fs-4 text-primary`}></i>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="fw-bold">{producto.nombre}</div>
                              <div className="text-muted small">ID: {producto.id}</div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-info bg-opacity-10 text-info">
                              {producto.categoria}
                            </span>
                          </td>
                          <td>
                            <code className="text-muted">{producto.codigo}</code>
                          </td>
                          <td className="fw-bold text-success">${producto.precio.toFixed(2)}</td>
                          <td>
                            <span className={`fw-bold ${getStockColor(producto.stock)}`}>
                              {producto.stock}
                            </span>
                          </td>
                          <td>
                            {getEstadoBadge(producto.estado, producto.stock)}
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-info"
                                title="Ver detalles"
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-warning"
                                title="Editar"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleEliminar(producto.id)}
                                title="Eliminar"
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

              {productosFiltrados.length === 0 && (
                <div className="text-center py-5">
                  <i className="bi bi-box-seam fs-1 text-muted mb-3"></i>
                  <h5 className="text-muted">No se encontraron productos</h5>
                  <p className="text-muted">Intenta cambiar los filtros o agregar nuevos productos</p>
                  <button className="btn btn-primary mt-2">
                    <i className="bi bi-plus-circle me-1"></i>
                    Agregar Producto
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};