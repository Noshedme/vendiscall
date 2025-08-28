// src/pages/Historial.jsx
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaReceipt, FaEye } from "react-icons/fa";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

export const Historial = () => {
  const { user } = useAuth ? useAuth() : { user: null };
  const [compras, setCompras] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1 });
  const [loading, setLoading] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const [detalleLoading, setDetalleLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    fetchCompras(1);
    // Si viniste desde FormularioPago con state (pedidoId) podrías abrir detalle — handled in FormularioPago via navigate state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchCompras = async (page = 1) => {
    if (!user?.id) {
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch(`${API}/api/historial/usuario/${user.id}?page=${page}&limit=10`);
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.message || "Error cargando historial");
      }
      setCompras(data.compras || []);
      setPagination(data.pagination || { current_page: page, total_pages: 1 });
    } catch (e) {
      console.error("Error cargando historial:", e);
      toast.error("No se pudo cargar el historial");
    } finally {
      setLoading(false);
    }
  };

  const abrirDetalle = async (compraId) => {
    setDetalleLoading(true);
    try {
      const resp = await fetch(`${API}/api/historial/${compraId}`);
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || "Error cargando detalle");
      setDetalle(data.compra || data);
      // abrir modal (usamos display simple)
      const modal = document.getElementById("historialDetalleModal");
      if (modal) modal.style.display = "block";
    } catch (e) {
      console.error("Error al obtener detalle:", e);
      toast.error("No se pudo obtener detalles de la compra");
    } finally {
      setDetalleLoading(false);
    }
  };

  const cerrarModal = () => {
    const modal = document.getElementById("historialDetalleModal");
    if (modal) modal.style.display = "none";
    setDetalle(null);
  };

  const handlePage = (newPage) => {
    if (newPage < 1 || newPage > (pagination.total_pages || 1)) return;
    fetchCompras(newPage);
  };

  if (!user || !user.id) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <p className="text-muted">Inicia sesión para ver tu historial de compras.</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <ToastContainer />
      <div className="container-fluid flex-grow-1">
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="text-danger fw-bold"><FaReceipt className="me-2" />Mi Historial de Compras</h2>
            </div>

            <div className="card shadow-sm">
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-4">Cargando...</div>
                ) : compras.length === 0 ? (
                  <div className="text-center text-muted py-4">No hay compras registradas.</div>
                ) : (
                  <>
                    <div className="list-group">
                      {compras.map((c) => (
                        <div key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-bold">{c.numero_factura || `FAC-${String(c.id).padStart(6, "0")}`}</div>
                            <div className="small text-muted">
                              {new Date(c.fecha_compra || c.fecha).toLocaleString()} • {c.total_items || 0} items • {c.tipo_entrega}
                            </div>
                          </div>
                          <div className="text-end">
                            <div className="fw-bold text-danger">${parseFloat(c.total).toFixed(2)}</div>
                            <div className="mt-2">
                              <button className="btn btn-sm btn-outline-primary" onClick={() => abrirDetalle(c.id)}>
                                <FaEye className="me-1" /> Ver
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <small className="text-muted">Página {pagination.current_page} de {pagination.total_pages}</small>
                      </div>
                      <div>
                        <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handlePage(pagination.current_page - 1)} disabled={pagination.current_page <= 1}>Anterior</button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePage(pagination.current_page + 1)} disabled={pagination.current_page >= pagination.total_pages}>Siguiente</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <footer className="bg-danger text-white py-2 text-center mt-auto">
        <small>Vendismarket — Historial de compras</small>
      </footer>

      {/* Modal simple (sin dependencia externa) */}
      <div id="historialDetalleModal" style={{ display: 'none', position: 'fixed', zIndex: 2000, left: 0, top: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)' }}>
        <div style={{ maxWidth: 880, margin: '40px auto', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Detalle de la compra</h5>
            <button className="btn btn-sm btn-outline-secondary" onClick={cerrarModal}>Cerrar</button>
          </div>
          <div className="p-3" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {detalleLoading ? (
              <div>Cargando...</div>
            ) : detalle ? (
              <>
                <div className="mb-2">
                  <strong>Factura:</strong> {detalle.numero_factura}
                </div>
                <div className="mb-2">
                  <strong>Cliente:</strong> {detalle.usuario_nombre} — {detalle.usuario_email}
                </div>
                <div className="mb-2">
                  <strong>Fecha:</strong> {new Date(detalle.fecha || detalle.fecha_compra).toLocaleString()}
                </div>
                <div className="mb-2">
                  <strong>Método pago:</strong> {detalle.metodo_pago}
                </div>
                <div className="mb-3">
                  <strong>Items:</strong>
                  <div className="list-group mt-2">
                    {(detalle.items || []).map((it) => (
                      <div className="list-group-item d-flex justify-content-between" key={it.id}>
                        <div>
                          <div className="fw-bold">{it.producto_nombre || it.producto_descripcion || 'Producto'}</div>
                          <div className="small text-muted">{it.cantidad} × ${parseFloat(it.precio_unitario || it.precio || 0).toFixed(2)}</div>
                        </div>
                        <div className="text-end fw-bold">${parseFloat(it.subtotal_item || it.subtotal || (it.precio_unitario * it.cantidad) || 0).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <div style={{ width: 300 }}>
                    <div className="d-flex justify-content-between"><small>Subtotal</small><small>${parseFloat(detalle.subtotal || detalle.total * 0.8 || 0).toFixed(2)}</small></div>
                    <div className="d-flex justify-content-between"><small>IVA</small><small>${parseFloat(detalle.iva || detalle.total * 0.2 || 0).toFixed(2)}</small></div>
                    <div className="d-flex justify-content-between"><small className="fw-bold">Total</small><small className="fw-bold text-danger">${parseFloat(detalle.total || 0).toFixed(2)}</small></div>
                  </div>
                </div>
              </>
            ) : (
              <div>No hay detalle disponible</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Historial;
