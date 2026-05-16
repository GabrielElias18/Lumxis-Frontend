import React, { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../../services/authServices';
import Swal from 'sweetalert2';
import './styles/Login.css';
import logo from './LoginAssets/logo.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔒 Verificación automática de autenticación
  useEffect(() => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (token && rol) {
      if (rol === 'administrador') {
        navigate('/admin');
      } else {
        navigate('/dashboard/inicio');
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage('Por favor, completa todos los campos.');
      return;
    }

    try {
      Swal.fire({
        title: "Iniciando sesión...",
        text: "Por favor espera un momento",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const data = await loginUser(username, password);

      Swal.close();

      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Bienvenido al panel de control",
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      localStorage.setItem('rol', data.usuario.rol);

      setUser(data.usuario);
      setMessage('¡Inicio de sesión exitoso!');

      if (data.usuario.rol === "administrador") {
        navigate('/admin');
      } else {
        navigate('/dashboard/inicio');
      }
    } catch (error) {
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Error de inicio de sesión",
        text: error.response?.data?.mensaje || "Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.",
        footer: '<a href="#">¿Necesitas ayuda con tu cuenta?</a>',
      });

      const errorMsg = error.response?.data?.mensaje || 'Error en el inicio de sesión.';
      setMessage(errorMsg);
    }
  };

  return (
    <div className="login-container">
      <button
        className="boton-home"
        onClick={() => navigate('/')}
      >
        <Home className="icono-home" />
        <span>Volver al Inicio</span>
      </button>

      <div className="login-wrapper">
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
              <h2>Iniciar Sesión</h2>
            </div>

            {message && (
              <div className={`mensaje ${message.includes('exitoso') ? 'exito' : 'error'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="input-grupo">
                <label htmlFor="username">Correo Electrónico</label>
                <input
                  type="email"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="correo@empresa.com"
                  required
                />
              </div>

              <div className="input-grupo">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="boton-submit">
                Iniciar Sesión
              </button>
            </form>

            <div className="registro-link">
              <button
                className="boton-registro"
                onClick={() => navigate('/registro')}
              >
                ¿No tienes cuenta? Regístrate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
