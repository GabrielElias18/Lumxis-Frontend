import React, { useEffect, useState } from 'react';
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  AlertTriangle,
  Clock,
  BarChart,
  Activity
} from 'lucide-react';
import './inicio.css';

function Inicio() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);

    // Actualizar la hora cada minuto
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="inicio-container">
      {/* Encabezado de bienvenida */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>
            ¡Bienvenido, {user?.primerNombre} {user?.primerApellido}!
          </h1>
          <p className="welcome-time">
            <Clock className="icon" />
            {currentTime.toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })} - {currentTime.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Tarjetas de acceso rápido */}
      <div className="quick-access-grid">
        <div className="quick-access-card">
          <Package className="card-icon" />
          <h3>Inventario</h3>
          <p>Gestiona tus productos y categorías</p>
          <ul>
            <li>Crear nuevos productos</li>
            <li>Actualizar stock</li>
            <li>Gestionar categorías</li>
          </ul>
        </div>

        <div className="quick-access-card">
          <ShoppingCart className="card-icon" />
          <h3>Ventas</h3>
          <p>Control de transacciones</p>
          <ul>
            <li>Registrar ventas</li>
            <li>Ver historial</li>
            <li>Gestionar devoluciones</li>
          </ul>
        </div>

        <div className="quick-access-card">
          <DollarSign className="card-icon" />
          <h3>Balance</h3>
          <p>Control financiero</p>
          <ul>
            <li>Registrar ingresos</li>
            <li>Registrar egresos</li>
            <li>Ver balance general</li>
          </ul>
        </div>

        <div className="quick-access-card">
          <BarChart className="card-icon" />
          <h3>Estadísticas</h3>
          <p>Análisis y reportes</p>
          <ul>
            <li>Ver tendencias</li>
            <li>Analizar ventas</li>
            <li>Generar informes</li>
          </ul>
        </div>
      </div>

      {/* Sección de información del sistema */}
      <div className="system-info">
        <div className="info-card updates">
          <div className="card-header">
            <Activity className="header-icon" />
            <h3>Estado del Sistema</h3>
          </div>
          <div className="status-indicator active">
            <span className="status-dot"></span>
            Sistema funcionando correctamente
          </div>
          <div className="version-info">
            <h4>Versión 1.0 (BETA)</h4>
            <p>Última actualización: Febrero 2024</p>
          </div>
        </div>

        <div className="info-card notifications">
          <div className="card-header">
            <AlertTriangle className="header-icon" />
            <h3>Recordatorios</h3>
          </div>
          <ul className="notification-list">
            <li>
              <span className="notification-icon">📊</span>
              Revisa tu inventario regularmente
            </li>
            <li>
              <span className="notification-icon">💰</span>
              Actualiza tu balance diariamente
            </li>
            <li>
              <span className="notification-icon">📈</span>
              Analiza las estadísticas semanalmente
            </li>
          </ul>
        </div>

        <div className="info-card features">
          <div className="card-header">
            <TrendingUp className="header-icon" />
            <h3>Funcionalidades Disponibles</h3>
          </div>
          <div className="featuress-grid">
            <div className="feature-item">
              <h4>Inventario</h4>
              <ul>
                <li>Gestión de productos</li>
                <li>Control de stock</li>
                <li>Categorización</li>
              </ul>
            </div>
            <div className="feature-item">
              <h4>Balance</h4>
              <ul>
                <li>Registro de ingresos</li>
                <li>Control de gastos</li>
                <li>Balance general</li>
              </ul>
            </div>
            <div className="feature-item">
              <h4>Estadísticas</h4>
              <ul>
                <li>Gráficos de ventas</li>
                <li>Tendencias mensuales</li>
                <li>Reportes detallados</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;