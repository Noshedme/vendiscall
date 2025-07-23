// src/pages/RegisterCliente.jsx
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import classNames from "classnames";
import AOS from "aos";
import "aos/dist/aos.css";

export function RegisterCliente() {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    usuario: "",
    cedula: "",
    celular: "",
    contrasena: "",
    confirmarContrasena: "",
    fecha_nacimiento: "",
    edificio: "",
    departamento: "",
    terminos: false,
  });

  const [errores, setErrores] = useState({});
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true
    });
  }, []);

  // Calcular progreso del formulario
  useEffect(() => {
    const camposCompletos = Object.entries(formData)
      .filter(([key]) => key !== "terminos")
      .filter(([key, value]) => value.trim() !== "").length;
    const totalCampos = Object.keys(formData).length - 1;
    setProgreso((camposCompletos / totalCampos) * 100);
  }, [formData]);

  const campos = [
    // Paso 1: Información personal
    [
      { label: "Nombres", name: "nombres", icon: "bi-person", placeholder: "Ingresa tus nombres" },
      { label: "Apellidos", name: "apellidos", icon: "bi-person-plus", placeholder: "Ingresa tus apellidos" },
      { label: "Usuario", name: "usuario", icon: "bi-at", placeholder: "Nombre de usuario único" },
      { label: "Cédula", name: "cedula", icon: "bi-card-text", placeholder: "1234567890" },
      { label: "Fecha de Nacimiento", name: "fecha_nacimiento", type: "date", icon: "bi-calendar-event" },
    ],
    // Paso 2: Contacto y ubicación
    [
      { label: "Número Celular", name: "celular", icon: "bi-phone", placeholder: "0987654321" },
      { label: "Edificio", name: "edificio", icon: "bi-building", placeholder: "Torre Azul" },
      { label: "Departamento", name: "departamento", icon: "bi-house-door", placeholder: "Apt. 301" },
    ],
    // Paso 3: Seguridad
    [
      { label: "Contraseña", name: "contrasena", type: "password", icon: "bi-lock", placeholder: "Mínimo 8 caracteres" },
      { label: "Confirmar Contraseña", name: "confirmarContrasena", type: "password", icon: "bi-shield-check", placeholder: "Repite tu contraseña" },
    ]
  ];

  const validarCedula = (cedula) => {
    if (cedula.length !== 10) return false;
    const digitos = cedula.split('').map(Number);
    const provincia = digitos[0] * 10 + digitos[1];
    if (provincia < 1 || provincia > 24) return false;
    
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;
    
    for (let i = 0; i < 9; i++) {
      let resultado = digitos[i] * coeficientes[i];
      if (resultado > 9) resultado -= 9;
      suma += resultado;
    }
    
    const digitoVerificador = suma % 10 === 0 ? 0 : 10 - (suma % 10);
    return digitoVerificador === digitos[9];
  };

  const validarUsuario = (usuario) => {
    // Solo letras, números y guiones bajos, mínimo 3 caracteres
    return /^[a-zA-Z0-9_]{3,20}$/.test(usuario);
  };

  const validarCelular = (celular) => {
    return /^09\d{8}$/.test(celular);
  };

  const validarContrasena = (contrasena) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(contrasena);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const valorFinal = type === "checkbox" ? checked : value;
    
    setFormData({ ...formData, [name]: valorFinal });

    // Validaciones específicas
    const nuevosErrores = { ...errores };
    
    if (name === "cedula" && value && !validarCedula(value)) {
      nuevosErrores[name] = "Cédula ecuatoriana inválida";
    } else if (name === "usuario" && value && !validarUsuario(value)) {
      nuevosErrores[name] = "3-20 caracteres, solo letras, números y _";
    } else if (name === "celular" && value && !validarCelular(value)) {
      nuevosErrores[name] = "Formato: 09XXXXXXXX";
    } else if (name === "contrasena" && value && !validarContrasena(value)) {
      nuevosErrores[name] = "Debe tener 8+ caracteres, mayúscula, minúscula, número y símbolo";
    } else if (name === "confirmarContrasena" && value && value !== formData.contrasena) {
      nuevosErrores[name] = "Las contraseñas no coinciden";
    } else if (value.trim() || type === "checkbox") {
      delete nuevosErrores[name];
    }
    
    setErrores(nuevosErrores);
  };

  const validarPaso = (paso) => {
    const camposPaso = campos[paso - 1];
    const erroresPaso = {};
    
    camposPaso.forEach(({ name }) => {
      if (!formData[name]?.trim()) {
        erroresPaso[name] = "Campo requerido";
      }
    });
    
    return Object.keys(erroresPaso).length === 0;
  };

  const siguientePaso = () => {
    if (validarPaso(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else {
      toast.warning("Completa todos los campos del paso actual");
    }
  };

  const pasoAnterior = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const nuevosErrores = {};
  Object.entries(formData).forEach(([campo, valor]) => {
    if (campo === "terminos") {
      if (!valor) nuevosErrores[campo] = "Debes aceptar los términos";
      return;
    }
    if (!valor.trim()) {
      nuevosErrores[campo] = "Campo requerido";
    }
  });

  if (formData.contrasena !== formData.confirmarContrasena) {
    nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden";
  }

  if (Object.keys(nuevosErrores).length > 0) {
    setErrores(nuevosErrores);
    return;
  }

  try {
    const res = await fetch("http://localhost:3001/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success("🎉 ¡Cuenta registrada exitosamente!");
      setFormData({
        nombres: "",
        apellidos: "",
        usuario: "",
        cedula: "",
        celular: "",
        contrasena: "",
        confirmarContrasena: "",
        fecha_nacimiento: "",
        edificio: "",
        departamento: "",
        terminos: false,
      });
      setCurrentStep(1);
    } else {
      const error = await res.json();
      toast.error(error.message || "Error al registrar");
    }
  } catch (err) {
    console.error("Error de red:", err);
    toast.error("Error de red al registrar");
  }
};


  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-4">
      <motion.div
        className="container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            {/* Header con logo */}
            <motion.div 
              className="text-center mb-4"
              data-aos="fade-down"
            >
              <div 
                className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow" 
                style={{ width: '70px', height: '70px' }}
              >
                <i className="bi bi-shop text-danger" style={{ fontSize: '2rem' }}></i>
              </div>
              <h2 className="fw-bold mb-2" style={{ color: 'var(--rojo)' }}>
                ¡Únete a Vendismarket!
              </h2>
              <p className="text-muted">Crea tu cuenta y disfruta de nuestros productos</p>
            </motion.div>

            {/* Card principal */}
            <motion.div
              className="card border-0 shadow-lg card-hover"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="card-body p-4">
                {/* Indicador de progreso */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <small className="text-muted fw-bold">Progreso del registro</small>
                    <small className="text-muted fw-bold">{Math.round(progreso)}%</small>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <motion.div
                      className="progress-bar"
                      style={{ backgroundColor: 'var(--rojo)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progreso}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                {/* Indicadores de pasos */}
                <div className="row mb-4">
                  {['Información Personal', 'Contacto y Ubicación', 'Seguridad'].map((titulo, index) => (
                    <div key={index} className="col-4 text-center">
                      <motion.div
                        className={classNames(
                          "rounded-circle d-inline-flex align-items-center justify-content-center mb-2",
                          {
                            "text-white": currentStep > index + 1,
                            "text-dark": currentStep === index + 1,
                            "bg-light text-muted": currentStep < index + 1,
                          }
                        )}
                        style={{ 
                          width: '35px', 
                          height: '35px',
                          backgroundColor: currentStep > index + 1 ? 'var(--rojo)' : 
                                          currentStep === index + 1 ? 'var(--amarillo)' : '#e9ecef'
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {currentStep > index + 1 ? (
                          <i className="bi bi-check-lg fw-bold"></i>
                        ) : (
                          <span className="fw-bold small">{index + 1}</span>
                        )}
                      </motion.div>
                      <div className="small fw-bold text-muted">{titulo}</div>
                    </div>
                  ))}
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={stepVariants}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="row g-3">
                        {campos[currentStep - 1].map(({ label, name, type = "text", icon, placeholder }) => (
                          <motion.div
                            className={name === "fecha_nacimiento" ? "col-12" : 
                                     name === "usuario" ? "col-12" : "col-md-6"}
                            key={name}
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <label className="form-label fw-bold">
                              <i className={`bi ${icon} me-2`} style={{ color: 'var(--rojo)' }}></i>
                              {label}
                            </label>
                            <div className="position-relative">
                              <input
                                type={
                                  name === "contrasena" ? (mostrarContrasena ? "text" : "password") :
                                  name === "confirmarContrasena" ? (mostrarConfirmar ? "text" : "password") :
                                  type
                                }
                                className={classNames("form-control", {
                                  "is-invalid": errores[name],
                                  "is-valid": formData[name] && !errores[name],
                                })}
                                style={{ 
                                  paddingRight: (name === "contrasena" || name === "confirmarContrasena") ? '45px' : '12px'
                                }}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                placeholder={placeholder}
                              />
                              
                              {/* Toggle contraseña */}
                              {name === "contrasena" && (
                                <button
                                  type="button"
                                  className="btn position-absolute end-0 top-50 translate-middle-y px-3"
                                  style={{ border: 'none', background: 'none' }}
                                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                                >
                                  <i className={`bi ${mostrarContrasena ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                                </button>
                              )}
                              
                              {name === "confirmarContrasena" && (
                                <button
                                  type="button"
                                  className="btn position-absolute end-0 top-50 translate-middle-y px-3"
                                  style={{ border: 'none', background: 'none' }}
                                  onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                                >
                                  <i className={`bi ${mostrarConfirmar ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                                </button>
                              )}
                            </div>
                            
                            <AnimatePresence>
                              {errores[name] && (
                                <motion.div
                                  className="invalid-feedback d-block"
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                >
                                  <i className="bi bi-exclamation-triangle me-1"></i>
                                  {errores[name]}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Términos y condiciones (solo en el último paso) */}
                  {currentStep === 3 && (
                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="terminos"
                          checked={formData.terminos}
                          onChange={handleChange}
                          style={{ transform: 'scale(1.1)' }}
                        />
                        <label className="form-check-label ms-2">
                          Acepto los{' '}
                          <a 
                            href="#" 
                            className="text-decoration-none fw-bold"
                            style={{ color: 'var(--rojo)' }}
                          >
                            términos y condiciones
                          </a>{' '}
                          de Vendismarket
                        </label>
                      </div>
                      {errores.terminos && (
                        <div className="text-danger small mt-1">
                          <i className="bi bi-exclamation-triangle me-1"></i>
                          {errores.terminos}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Botones de navegación */}
                  <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                    {currentStep > 1 ? (
                      <motion.button
                        type="button"
                        className="btn btn-outline-secondary px-4"
                        onClick={pasoAnterior}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Anterior
                      </motion.button>
                    ) : (
                      <div></div>
                    )}

                    {currentStep < 3 ? (
                      <motion.button
                        type="button"
                        className="btn btn-primary px-4"
                        onClick={siguientePaso}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Siguiente
                        <i className="bi bi-arrow-right ms-2"></i>
                      </motion.button>
                    ) : (
                      <motion.button
                        type="submit"
                        className="btn btn-primary btn-lg px-5"
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 8px 20px rgba(198, 40, 40, 0.3)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        style={{ 
                          backgroundColor: 'var(--rojo)',
                          borderColor: 'var(--rojo)'
                        }}
                      >
                        <i className="bi bi-check-circle me-2"></i>
                        Crear Cuenta
                      </motion.button>
                    )}
                  </div>
                </form>

                {/* Link para login */}
                <motion.div
                  className="text-center mt-4 pt-3 border-top"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-muted mb-0">
                    ¿Ya tienes cuenta?{' '}
                    <a 
                      href="#" 
                      className="text-decoration-none fw-bold"
                      style={{ color: 'var(--rojo)' }}
                    >
                      Inicia sesión aquí
                    </a>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          borderLeft: `4px solid var(--rojo)`,
        }}
      />
    </div>
  );
}