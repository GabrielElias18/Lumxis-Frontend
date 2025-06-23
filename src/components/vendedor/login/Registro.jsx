import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Home } from 'lucide-react';
import Swal from 'sweetalert2';
import { registerUser } from '../../../services/authServices';
import './styles/Registro.css';
import logo from './LoginAssets/logo.png'

function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    correo: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarEmail(formData.correo)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Por favor, ingresa un correo electrónico válido.',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la contraseña',
        text: 'Las contraseñas no coinciden.',
      });
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        primerNombre: formData.primerNombre,
        segundoNombre: formData.segundoNombre,
        primerApellido: formData.primerApellido,
        segundoApellido: formData.segundoApellido,
        correo: formData.correo,
        telefono: formData.telefono,
        contraseña: formData.password,
        rol: 'vendedor' // 🔹 Asegurar que se registre como vendedor
      });

      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Serás redirigido al login.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => navigate('/login')
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: error.message || 'Ocurrió un problema al registrar el usuario.',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="registro-container">
      <button
        className="boton-home"
        onClick={() => navigate('/')}
      >
        <Home className="icono-home" />
        <span>Volver al Inicio</span>
      </button>
      <div className="registro-wrapper">
        {/* Sección izquierda - Imagen */}
        <div className="imagen-seccion">
          <div className="imagen-overlay" />
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
            alt="Gestión de Inventario"
            className="imagen-fondo"
          />
          <div className="imagen-contenido">
            <h2>Sistema de Gestión de Inventarios</h2>
            <p>Optimiza tu inventario y mejora la eficiencia de tu negocio con nuestra solución gratuita.</p>
          </div>
        </div>

        {/* Sección derecha - Formulario */}
        <div className="formulario-seccion">
          <div className="formulario-contenedor">
            <div className="encabezado">
              <button className="logo-boton" onClick={() => navigate('/')}>
                <img src={logo} alt="Logo" className="logo-login" />
              </button>
              <h2>Registro de Usuario</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grupo-inputs">
                <div className="input-grupo">
                  <label htmlFor="primerNombre">Primer Nombre</label>
                  <input
                    type="text"
                    id="primerNombre"
                    name="primerNombre"
                    value={formData.primerNombre}
                    onChange={handleChange}
                    placeholder="Juan"
                    required
                  />
                </div>

                <div className="input-grupo">
                  <label htmlFor="segundoNombre">Segundo Nombre</label>
                  <input
                    type="text"
                    id="segundoNombre"
                    name="segundoNombre"
                    value={formData.segundoNombre}
                    onChange={handleChange}
                    placeholder="Antonio"
                  />
                </div>
              </div>

              <div className="grupo-inputs">
                <div className="input-grupo">
                  <label htmlFor="primerApellido">Primer Apellido</label>
                  <input
                    type="text"
                    id="primerApellido"
                    name="primerApellido"
                    value={formData.primerApellido}
                    onChange={handleChange}
                    placeholder="Pérez"
                    required
                  />
                </div>

                <div className="input-grupo">
                  <label htmlFor="segundoApellido">Segundo Apellido</label>
                  <input
                    type="text"
                    id="segundoApellido"
                    name="segundoApellido"
                    value={formData.segundoApellido}
                    onChange={handleChange}
                    placeholder="García"
                  />
                </div>
              </div>

              <div className="input-grupo">
                <label htmlFor="correo">Correo Electrónico</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="correo@empresa.com"
                  required
                />
              </div>

              <div className="input-grupo">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  required
                />
              </div>

              <div className="input-grupo">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="input-grupo">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="boton-submit" disabled={loading}>
                {loading ? 'Registrando...' : 'Crear Cuenta'}
              </button>
            </form>

            <div className="volver-login">
              <button
                className="boton-volver"
                onClick={() => navigate('/login')}
              >
                ¿Ya tienes cuenta? Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;