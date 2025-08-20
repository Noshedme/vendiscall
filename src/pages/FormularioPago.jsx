// src/pages/FormularioPago.jsx
import React, { useState, useEffect, useRef } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaStore,
  FaHome,
  FaArrowLeft,
  FaCheckCircle,
  FaQrcode,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaCalculator,
  FaUser
} from "react-icons/fa";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext"; // si no existe ajusta o elimina

/**
 * FormularioPago.jsx
 * - Envía la venta al endpoint POST /api/ventas (API configurable por REACT_APP_API_URL)
 * - Si la API no responde, guarda la venta en localStorage como fallback (ventas_offline)
 * - El cajero podrá ver las ventas desde la API (o desde localStorage si usas fallback)
 *
 * NOTA: Ajusta la URL de la API con REACT_APP_API_URL (ej: http://localhost:3001)
 */

export const FormularioPago = () => {
  const [carrito, setCarrito] = useState([]);
  const [tipoEntrega, setTipoEntrega] = useState("tienda"); // "tienda" o "domicilio"
  const [metodoPago, setMetodoPago] = useState(""); // "tarjeta", "transferencia", "efectivo"
  const [datosCliente, setDatosCliente] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: ""
  });
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: "",
    nombre: "",
    expiracion: "",
    cvv: ""
  });
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [paso, setPaso] = useState(1); // 1: Cliente, 2: Entrega, 3: Pago
  const navigate = useNavigate();
  const { user } = useAuth ? useAuth() : { user: null };

  // QR estático (imagen en public/ImagenQR.png)
  const qrStatic = "/ImagenQR.png";

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = () => {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
      try {
        setCarrito(JSON.parse(carritoGuardado));
      } catch {
        setCarrito([]);
      }
    } else {
      // Si no hay carrito, redirigir al carrito
      navigate("/cliente/carrito");
    }
  };

  const calcularSubtotal = () => {
    return carrito.reduce((total, item) => total + (parseFloat(item.precio || 0) * (item.cantidad || 1)), 0);
  };

  const calcularIVA = () => {
    return calcularSubtotal() * 0.15; // IVA 15%
  };

  const calcularRecargoEnvio = () => {
    return tipoEntrega === "domicilio" ? calcularSubtotal() * 0.03 : 0; // 3% recargo por envío
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularIVA() + calcularRecargoEnvio();
  };

  const handleInputChange = (e, seccion) => {
    const { name, value } = e.target;

    if (seccion === "cliente") {
      setDatosCliente(prev => ({ ...prev, [name]: value }));
    } else if (seccion === "tarjeta") {
      let formattedValue = value;

      // Formateos simples
      if (name === "numero") {
        formattedValue = value.replace(/\s/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
      } else if (name === "expiracion") {
        formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
      } else if (name === "cvv") {
        formattedValue = value.replace(/\D/g, "").slice(0, 4);
      }

      setDatosTarjeta(prev => ({ ...prev, [name]: formattedValue }));
    }
  };

  const validarFormulario = () => {
    // Datos cliente obligatorios
    if (!datosCliente.nombre || !datosCliente.email || !datosCliente.telefono) {
      toast.error("Por favor completa los datos personales obligatorios");
      return false;
    }
    // Dirección si es domicilio
    if (tipoEntrega === "domicilio" && (!datosCliente.direccion || !datosCliente.ciudad)) {
      toast.error("Por favor completa la dirección de entrega");
      return false;
    }
    // Método de pago
    if (!metodoPago) {
      toast.error("Por favor selecciona un método de pago");
      return false;
    }
    // Si tarjeta, validar campos tarjeta
    if (metodoPago === "tarjeta") {
      if (!datosTarjeta.numero || !datosTarjeta.nombre || !datosTarjeta.expiracion || !datosTarjeta.cvv) {
        toast.error("Por favor completa todos los datos de la tarjeta");
        return false;
      }
    }
    return true;
  };

  // Fallback si el servidor no responde: guardar venta en localStorage
  const guardarVentaOffline = (venta) => {
    try {
      const ventas = JSON.parse(localStorage.getItem("ventas_offline") || "[]");
      ventas.push(venta);
      localStorage.setItem("ventas_offline", JSON.stringify(ventas));
      return true;
    } catch (e) {
      console.error("Error guardando venta offline:", e);
      return false;
    }
  };

  // Procesar pago -> enviar a API /api/ventas
  const procesarPago = async () => {
    if (!validarFormulario()) return;

    if (carrito.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    // --- Notificación inmediata y limpieza de carrito ---
    toast.success("¡Compra realizada! El cajero revisará tu pedido.");
    localStorage.removeItem("carrito");
    setCarrito([]); // Esto vacía el carrito para el usuario
    setProcesandoPago(true);
    setTimeout(() => navigate("/cliente"), 1200);

    // --- Envío al backend en segundo plano ---
    const API = process.env.REACT_APP_API_URL || "http://localhost:3001";
    const nuevaVenta = {
      usuario_id: user?.id || null,
      usuario_nombre: datosCliente.nombre,
      usuario_email: datosCliente.email,
      items: carrito.map(it => ({
        id: it.id || null,
        nombre: it.nombre || it.title || "Producto",
        cantidad: it.cantidad || 1,
        precio_unitario: parseFloat(it.precio || 0)
      })),
      subtotal: parseFloat(calcularSubtotal().toFixed(2)),
      iva: parseFloat(calcularIVA().toFixed(2)),
      recargo_envio: parseFloat(calcularRecargoEnvio().toFixed(2)),
      total: parseFloat(calcularTotal().toFixed(2)),
      metodoPago,
      tipoEntrega,
      notas: ""
    };

    try {
      const resp = await fetch(`${API}/api/ventas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaVenta),
      });
      // No mostrar más toasts aquí, ya se notificó al usuario
    } catch (err) {
      // Fallback: guardar en localStorage si falla
      guardarVentaOffline({
        ...nuevaVenta,
        id: Date.now(),
        fecha_creacion: new Date().toISOString(),
        estado: "pendiente_offline"
      });
    } finally {
      setProcesandoPago(false);
    }
  };

  const handleSiguiente = () => {
    if (paso === 1) {
      if (!datosCliente.nombre || !datosCliente.email || !datosCliente.telefono) {
        toast.error("Por favor completa los datos personales obligatorios");
        return;
      }
    }
    if (paso === 2 && tipoEntrega === "domicilio" && (!datosCliente.direccion || !datosCliente.ciudad)) {
      toast.error("Por favor completa la dirección de entrega");
      return;
    }
    setPaso(prev => prev + 1);

    // hacer scroll al área de pago si aplica
    if (paso + 1 === 3) {
      setTimeout(() => {
        const el = document.getElementById("metodo-pago-area");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    }
  };

  const handleAtras = () => setPaso(prev => Math.max(1, prev - 1));
  const volverAlCarrito = () => navigate("/cliente/carrito");

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <ToastContainer />
      <div className="container-fluid flex-grow-1">
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4" style={{ paddingBottom: "180px" }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center border-bottom mb-3">
              <h2 className="text-danger fw-bold mb-0" style={{ fontSize: "1.5rem" }}>
                <FaCreditCard className="me-2" />
                Finalizar Compra
              </h2>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={volverAlCarrito}
              >
                <FaArrowLeft className="me-2" />
                Volver al carrito
              </button>
            </div>

            <div className="row">
              {/* Formulario por pasos */}
              <div className="col-lg-7">
                {/* Indicador de pasos */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className={`step-indicator ${paso === 1 ? "active" : ""}`}>
                    <FaUser /> <span className="d-none d-md-inline">Cliente</span>
                  </div>
                  <div className="flex-grow-1 border-bottom mx-2" style={{ height: 2, background: "#ddd" }} />
                  <div className={`step-indicator ${paso === 2 ? "active" : ""}`}>
                    <FaMapMarkerAlt /> <span className="d-none d-md-inline">Entrega</span>
                  </div>
                  <div className="flex-grow-1 border-bottom mx-2" style={{ height: 2, background: "#ddd" }} />
                  <div className={`step-indicator ${paso === 3 ? "active" : ""}`}>
                    <FaCreditCard /> <span className="d-none d-md-inline">Pago</span>
                  </div>
                </div>

                {/* Paso 1: Datos del Cliente */}
                {paso === 1 && (
                  <motion.div
                    className="card shadow-sm mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ borderRadius: "10px", minHeight: "180px" }}
                  >
                    <div className="card-header bg-danger text-white py-2" style={{ borderRadius: "10px 10px 0 0" }}>
                      <h6 className="mb-0" style={{ fontSize: "1rem" }}>
                        <FaUser className="me-2" />
                        Datos del Cliente
                      </h6>
                    </div>
                    <div className="card-body py-2">
                      <div className="row g-2">
                        <div className="col-md-4">
                          <label className="form-label small">Nombre completo *</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="nombre"
                            value={datosCliente.nombre}
                            onChange={(e) => handleInputChange(e, "cliente")}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small">Email *</label>
                          <input
                            type="email"
                            className="form-control form-control-sm"
                            name="email"
                            value={datosCliente.email}
                            onChange={(e) => handleInputChange(e, "cliente")}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small">Teléfono *</label>
                          <input
                            type="tel"
                            className="form-control form-control-sm"
                            name="telefono"
                            value={datosCliente.telefono}
                            onChange={(e) => handleInputChange(e, "cliente")}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Paso 2: Tipo de Entrega */}
                {paso === 2 && (
                  <motion.div
                    className="card shadow-sm mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ borderRadius: "10px", minHeight: "120px" }}
                  >
                    <div className="card-header bg-warning text-dark py-2" style={{ borderRadius: "10px 10px 0 0" }}>
                      <h6 className="mb-0" style={{ fontSize: "1rem" }}>
                        <FaMapMarkerAlt className="me-2" />
                        Tipo de Entrega
                      </h6>
                    </div>
                    <div className="card-body py-2">
                      <div className="row">
                        <div className="col-6">
                          <div className="form-check p-0">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="tipoEntrega"
                              id="retirarTienda"
                              checked={tipoEntrega === "tienda"}
                              onChange={() => setTipoEntrega("tienda")}
                            />
                            <label className="form-check-label w-100" htmlFor="retirarTienda">
                              <div className="border rounded p-1 d-flex align-items-center h-100" style={{ minHeight: "40px" }}>
                                <FaStore className="me-2 text-primary fs-6" />
                                <div>
                                  <div className="fw-bold small">Retirar en tienda</div>
                                  <small className="text-muted">Sin costo</small>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-check p-0">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="tipoEntrega"
                              id="enviodomicilio"
                              checked={tipoEntrega === "domicilio"}
                              onChange={() => setTipoEntrega("domicilio")}
                            />
                            <label className="form-check-label w-100" htmlFor="enviodomicilio">
                              <div className="border rounded p-1 d-flex align-items-center h-100" style={{ minHeight: "40px" }}>
                                <FaHome className="me-2 text-success fs-6" />
                                <div>
                                  <div className="fw-bold small">Envío a domicilio</div>
                                  <small className="text-muted">+3% subtotal</small>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                      {/* Dirección si es envío a domicilio */}
                      {tipoEntrega === "domicilio" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-2 p-2 bg-light rounded"
                        >
                          <h6 className="small mb-2">Dirección de entrega:</h6>
                          <div className="row g-2">
                            <div className="col-12">
                              <label className="form-label small">Dirección completa *</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                name="direccion"
                                value={datosCliente.direccion}
                                onChange={(e) => handleInputChange(e, "cliente")}
                                placeholder="Calle, número, referencias"
                              />
                            </div>
                            <div className="col-8">
                              <label className="form-label small">Ciudad *</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                name="ciudad"
                                value={datosCliente.ciudad}
                                onChange={(e) => handleInputChange(e, "cliente")}
                              />
                            </div>
                            <div className="col-4">
                              <label className="form-label small">Código postal</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                name="codigoPostal"
                                value={datosCliente.codigoPostal}
                                onChange={(e) => handleInputChange(e, "cliente")}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Paso 3: Método de Pago */}
                {paso === 3 && (
                  <motion.div
                    id="metodo-pago-area"
                    className="card shadow-sm mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ borderRadius: "10px", minHeight: "120px" }}
                  >
                    <div className="card-header bg-danger text-white py-2" style={{ borderRadius: "10px 10px 0 0" }}>
                      <h6 className="mb-0" style={{ fontSize: "1rem" }}>
                        <FaCreditCard className="me-2" />
                        Método de Pago
                      </h6>
                    </div>
                    <div className="card-body py-2">
                      <div className="row mb-2">
                        <div className="col-4">
                          <div className="form-check p-0">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="metodoPago"
                              id="tarjeta"
                              checked={metodoPago === "tarjeta"}
                              onChange={() => setMetodoPago("tarjeta")}
                            />
                            <label className="form-check-label w-100" htmlFor="tarjeta">
                              <div className="text-center p-1 border rounded" style={{ minHeight: "50px" }}>
                                <FaCreditCard className="fs-5 text-danger mb-1" />
                                <div className="small fw-bold">Tarjeta</div>
                              </div>
                            </label>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="form-check p-0">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="metodoPago"
                              id="transferencia"
                              checked={metodoPago === "transferencia"}
                              onChange={() => setMetodoPago("transferencia")}
                            />
                            <label className="form-check-label w-100" htmlFor="transferencia">
                              <div className="text-center p-1 border rounded" style={{ minHeight: "50px" }}>
                                <FaExchangeAlt className="fs-5 text-warning mb-1" />
                                <div className="small fw-bold">Transferencia</div>
                              </div>
                            </label>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="form-check p-0">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="metodoPago"
                              id="efectivo"
                              checked={metodoPago === "efectivo"}
                              onChange={() => setMetodoPago("efectivo")}
                            />
                            <label className="form-check-label w-100" htmlFor="efectivo">
                              <div className="text-center p-1 border rounded" style={{ minHeight: "50px" }}>
                                <FaMoneyBillWave className="fs-5 text-warning mb-1" />
                                <div className="small fw-bold">Efectivo</div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Formulario de tarjeta */}
                      {metodoPago === "tarjeta" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="p-2 bg-light rounded mt-2"
                        >
                          <h6 className="small mb-2">Datos de la tarjeta:</h6>
                          <div className="row g-2">
                            <div className="col-12">
                              <label className="form-label small">Número de tarjeta</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                name="numero"
                                value={datosTarjeta.numero}
                                onChange={(e) => handleInputChange(e, "tarjeta")}
                                placeholder="1234 5678 9012 3456"
                                maxLength="19"
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label small">Nombre del titular</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                name="nombre"
                                value={datosTarjeta.nombre}
                                onChange={(e) => handleInputChange(e, "tarjeta")}
                                placeholder="Como aparece en la tarjeta"
                              />
                            </div>
                            <div className="col-6">
                              <label className="form-label small">Expiración</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                name="expiracion"
                                value={datosTarjeta.expiracion}
                                onChange={(e) => handleInputChange(e, "tarjeta")}
                                placeholder="MM/YY"
                                maxLength="5"
                              />
                            </div>
                            <div className="col-6">
                              <label className="form-label small">CVV</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                name="cvv"
                                value={datosTarjeta.cvv}
                                onChange={(e) => handleInputChange(e, "tarjeta")}
                                placeholder="123"
                                maxLength="4"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Transferencia: QR ESTÁTICO */}
                      {metodoPago === "transferencia" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="p-2 bg-light rounded mt-2 text-center"
                        >
                          <FaQrcode className="fs-3 text-warning mb-2" />
                          <h6 className="small">Transferencia DeUna - Banco Pichincha</h6>
                          <p className="small text-muted mb-2">
                            Escanea el código QR para transferir a DeUna (Banco Pichincha).
                          </p>

                          <div className="row justify-content-center g-2">
                            <div className="col-auto">
                              <div className="qr-box border rounded p-2 d-flex flex-column align-items-center" style={{ minWidth: "160px" }}>
                                <img
                                  src={qrStatic}
                                  alt="QR - Transferencia"
                                  style={{ maxWidth: "160px", maxHeight: "160px", objectFit: "contain" }}
                                />
                                <small className="mt-2 text-muted">QR de transferencia</small>
                              </div>
                            </div>

                            <div className="col-auto align-self-center">
                              <div className="text-start">
                                <div><strong>Beneficiario:</strong> DeUna Ecuador</div>
                                <div><strong>Banco:</strong> Banco Pichincha</div>
                                <div><strong>Tipo:</strong> Cuenta Corriente</div>
                                <div><strong>N° Cuenta:</strong> 123-4567890-1</div>
                                <div className="small text-muted">(Ejemplo — reemplaza por tus datos reales)</div>
                              </div>
                            </div>
                          </div>

                          <div className="alert alert-info py-2 mt-3 mb-0">
                            <small>
                              Una vez realizada la transferencia, el cajero podrá confirmar el pago desde su panel.
                            </small>
                          </div>
                        </motion.div>
                      )}

                      {/* Efectivo */}
                      {metodoPago === "efectivo" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="p-2 bg-light rounded mt-2"
                        >
                          <div className="alert alert-warning py-2 mb-0">
                            <FaMoneyBillWave className="me-2" />
                            <strong className="small">Pago en efectivo</strong>
                            <br />
                            <small>
                              {tipoEntrega === "tienda"
                                ? "Pagarás al retirar tu pedido en la tienda."
                                : "Pagarás al recibir tu pedido en la dirección indicada."
                              }
                            </small>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
                {/* Botones: dejamos barra fija abajo (fuera del flujo) */}
              </div>

              {/* Resumen de compra */}
              <div className="col-lg-5">
                <motion.div
                  className="card shadow-sm sticky-top resumen-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{ top: "20px" }}
                >
                  <div className="card-header bg-warning text-dark">
                    <h5 className="mb-0">
                      <FaShoppingCart className="me-2" />
                      Resumen del Pedido
                    </h5>
                  </div>
                  <div className="card-body">
                    {/* Productos */}
                    <div className="mb-3">
                      <div className="row g-2">
                        {carrito.map((item, index) => (
                          <div className="col-12" key={item.id || index}>
                            <div className="card border-0 shadow-sm mb-1">
                              <div className="card-body py-2 px-3 d-flex justify-content-between align-items-center">
                                <div>
                                  <div className="fw-bold small text-truncate" style={{ maxWidth: "120px" }}>
                                    {item.nombre}
                                  </div>
                                  <div className="text-muted small">
                                    {item.cantidad} × ${parseFloat(item.precio).toFixed(2)}
                                  </div>
                                </div>
                                <div className="text-end">
                                  <span className="fw-bold small">
                                    ${(item.precio * item.cantidad).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {carrito.length === 0 && (
                          <div className="col-12">
                            <div className="text-center small text-muted py-2">No hay productos en el carrito</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <hr />

                    {/* Cálculos */}
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>${calcularSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>IVA (15%):</span>
                      <span>${calcularIVA().toFixed(2)}</span>
                    </div>
                    {tipoEntrega === "domicilio" && (
                      <div className="d-flex justify-content-between mb-2 text-warning">
                        <span>Recargo envío (3%):</span>
                        <span>+${calcularRecargoEnvio().toFixed(2)}</span>
                      </div>
                    )}

                    <hr />

                    <div className="d-flex justify-content-between mb-4">
                      <span className="fs-5 fw-bold">Total:</span>
                      <span className="fs-4 fw-bold text-danger">
                        ${calcularTotal().toFixed(2)}
                      </span>
                    </div>

                    {/* Info adicional */}
                    <div className="mb-4">
                      <div className="d-flex align-items-center mb-2">
                        {tipoEntrega === "tienda" ? <FaStore className="me-2 text-primary" /> : <FaHome className="me-2 text-success" />}
                        <small>{tipoEntrega === "tienda" ? "Retirar en tienda" : "Envío a domicilio"}</small>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <FaCreditCard className="me-2 text-info" />
                        <small>
                          {metodoPago === "tarjeta" && "Pago con tarjeta"}
                          {metodoPago === "transferencia" && "Transferencia bancaria"}
                          {metodoPago === "efectivo" && "Pago en efectivo"}
                          {!metodoPago && "Selecciona método de pago"}
                        </small>
                      </div>
                    </div>

                    <div className="text-center">
                      <button className="btn btn-outline-danger btn-sm" onClick={() => window.print()}>
                        <FaCalculator className="me-1" /> Imprimir resumen
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Barra de acciones fija, separada del footer */}
      <div className="action-bar">
        <div className="container d-flex justify-content-between align-items-center action-inner">
          <div>
            {paso > 1 ? (
              <button className="btn btn-outline-warning btn-sm" onClick={handleAtras}>
                Atrás
              </button>
            ) : (
              <button className="btn btn-outline-danger btn-sm" onClick={volverAlCarrito}>
                <FaArrowLeft className="me-1" /> Volver al carrito
              </button>
            )}
          </div>

          <div>
            {paso < 3 && (
              <button className="btn btn-danger btn-sm" onClick={handleSiguiente}>
                Siguiente
              </button>
            )}
            {paso === 3 && (
              <button
                className="btn btn-warning btn-sm"
                onClick={procesarPago}
                disabled={procesandoPago || !metodoPago}
              >
                {procesandoPago ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="me-2" />
                    Confirmar Pedido
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-danger text-white py-2 text-center mt-auto">
        <small>Vendismarket — Compra segura garantizada.</small>
      </footer>

      {/* Estilos rápidos */}
      <style>{`
        .step-indicator {
          display: flex;
          align-items: center;
          font-size: 1rem;
          color: #aaa;
          font-weight: 500;
        }
        .step-indicator.active {
          color: #dc3545; /* rojo bootstrap */
        }
        .card {
          border-radius: 10px !important;
        }
        .card-header {
          border-radius: 10px 10px 0 0 !important;
        }

        .resumen-card .card-body {
          max-height: calc(100vh - 220px);
          overflow-y: auto;
        }

        .action-bar {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 72px;
          z-index: 1200;
          pointer-events: none;
        }
        .action-bar .action-inner {
          max-width: 1100px;
          margin: 0 auto;
          background: rgba(255,255,255,0.98);
          padding: 10px;
          border-radius: 10px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.12);
          pointer-events: auto;
        }

        @media (max-width: 991px) {
          .action-bar {
            left: 12px;
            right: 12px;
            bottom: 78px;
          }
          main {
            padding-bottom: 220px !important;
          }
        }

        .qr-box {
          transition: all 0.12s ease;
        }

        @media (max-width: 1199px) {
          .resumen-card {
            position: sticky;
            top: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default FormularioPago;
