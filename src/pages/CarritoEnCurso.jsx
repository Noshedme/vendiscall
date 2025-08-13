// src/pages/CarritoEnCurso.jsx
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { FaClipboardList, FaUserCheck, FaCheck, FaTimes, FaSearch, FaEye, FaSyncAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; // opcional
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "http://localhost:3001";

export const CarritoEnCurso = () => {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [detalles, setDetalles] = useState(null);
  const [search, setSearch] = useState("");
  const { user } = useAuth ? useAuth() : { user: null };

  const cargar = async () => {
    setCargando(true);
    try {
      const url = `${API}/api/ventas?estado=pendiente`;
      const res = await fetch(url);
      const data = await res.json();
      // también traer en_proceso: combinamos
      const res2 = await fetch(`${API}/api/ventas?estado=en_proceso`);
      const data2 = await res2.json();
      const merged = [...(data || []), ...(data2 || [])].sort((a,b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
      setVentas(merged);
    } catch (err) {
      console.error(err);
      toast.error("Error cargando ventas");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
    const t = setInterval(cargar, 5000); // poll cada 5s
    return () => clearInterval(t);
  }, []);

  const verDetalles = async (id) => {
    try {
      const res = await fetch(`${API}/api/ventas/${id}`);
      if (!res.ok) throw new Error("No se pudo obtener detalles");
      const data = await res.json();
      setDetalles(data);
    } catch (err) {
      console.error(err);
      toast.error("No se pudo obtener detalles");
    }
  };

  const actualizar = async (id, cambios) => {
    try {
      const res = await fetch(`${API}/api/ventas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cambios),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Error");
      }
      toast.success("Actualizado");
      cargar();
      return true;
    } catch (err) {
      console.error(err);
      toast.error("No se pudo actualizar: " + (err.message || ""));
      return false;
    }
  };

  const asignarme = (venta) => {
    if (!user) return toast.info("Inicia sesión como cajero para asignarte la venta.");
    actualizar(venta.id, { estado: "en_proceso", cajero_id: user.id });
  };

  const confirmar = (venta) => {
    if (!user) return toast.info("Inicia sesión como cajero para confirmar.");
    // la API intentará decrementar stock si aplica
    actualizar(venta.id, { estado: "confirmada", cajero_id: user.id, fecha_confirmacion: new Date().toISOString() });
  };

  const rechazar = (venta) => {
    actualizar(venta.id, { estado: "rechazada" });
  };

  const filtrado = ventas.filter(v => {
    if (!search) return true;
    const s = search.toLowerCase();
    return String(v.id).includes(s) || (v.usuario_nombre && v.usuario_nombre.toLowerCase().includes(s)) || (v.usuario_email && v.usuario_email.toLowerCase().includes(s));
  });

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container-fluid flex-grow-1">
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom">
              <h2><FaClipboardList className="me-2" />Carrito en Curso</h2>
              <div>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={cargar}><FaSyncAlt /></button>
                <small className="text-muted">{cargando ? "Cargando..." : `${ventas.length} pedidos`}</small>
              </div>
            </div>

            <div className="mb-3 d-flex gap-2">
              <div className="input-group input-group-sm" style={{ maxWidth: 420 }}>
                <span className="input-group-text"><FaSearch /></span>
                <input className="form-control form-control-sm" placeholder="Buscar por id o cliente" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>

            <div>
              {filtrado.length === 0 && <div className="alert alert-secondary">No hay pedidos en curso.</div>}
              {filtrado.map(v => (
                <div className="card mb-2 shadow-sm" key={v.id}>
                  <div className="card-body d-flex justify-content-between">
                    <div>
                      <div className="fw-bold">#{v.id} — {v.usuario_nombre || v.usuario_email}</div>
                      <div className="small text-muted">{new Date(v.fecha_creacion).toLocaleString()}</div>
                      <div className="small">Total: ${Number(v.total || 0).toFixed(2)} — Pago: {v.metodo_pago || v.metodoPago}</div>
                      <div className="mt-2">
                        <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => verDetalles(v.id)}><FaEye className="me-1" />Ver detalles</button>
                      </div>
                    </div>

                    <div className="text-end">
                      <div className="mb-2">
                        <span className={`badge ${v.estado === "pendiente" ? "bg-warning text-dark" : "bg-info"}`}>{v.estado}</span>
                      </div>
                      <div className="d-flex flex-column">
                        <button className="btn btn-sm btn-outline-primary mb-1" onClick={() => asignarme(v)}><FaUserCheck className="me-1" />Asignarme</button>
                        <button className="btn btn-sm btn-success mb-1" onClick={() => confirmar(v)}><FaCheck className="me-1" />Confirmar</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => rechazar(v)}><FaTimes className="me-1" />Rechazar</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {detalles && (
              <div className="card mt-3">
                <div className="card-header d-flex justify-content-between">
                  <div><strong>Detalle pedido #{detalles.venta.id}</strong></div>
                  <div><button className="btn btn-sm btn-outline-secondary" onClick={() => setDetalles(null)}>Cerrar</button></div>
                </div>
                <div className="card-body">
                  <div><strong>Cliente:</strong> {detalles.venta.usuario_nombre} — {detalles.venta.usuario_email}</div>
                  <div className="mt-2"><strong>Totales:</strong> ${Number(detalles.venta.total).toFixed(2)}</div>
                  <div className="mt-2"><strong>Items:</strong>
                    <ul>
                      {detalles.detalles.map(d => (
                        <li key={d.id}>{d.cantidad} × {d.nombre_producto} — ${Number(d.precio_unitario).toFixed(2)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      <footer className="bg-dark text-white py-2 text-center mt-auto">
        <small>Vendismarket — Carrito en Curso</small>
      </footer>
    </div>
  );
};

export default CarritoEnCurso;
