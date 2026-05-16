import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  LineChart,
  DollarSign,
  LogOut,
  Menu,
  ShoppingCart,
  Users,
  Truck,
  Tag,
  Settings,
  X
} from 'lucide-react';

import Swal from 'sweetalert2';
import './styles/Sidebar.css';
import logo from '../../login/LoginAssets/logo.png';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Tu sesión se cerrará y deberás iniciar sesión nuevamente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('rol');
        Swal.fire({
          title: "Sesión cerrada",
          text: "Has cerrado sesión exitosamente.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK"
        }).then(() => navigate("/"));
      }
    });
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <>
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="logo-container">
          <Link to="/dashboard/inicio" onClick={() => setIsOpen(false)}>
            <img src={logo} alt="Logo" className="custom-logo" />
          </Link>
        </div>

        <div className="menu-container">
          <nav className="menu-items">

            {/* PRINCIPAL */}
            <span className="menu-section-title">Principal</span>

            <Link
              to="inicio"
              className={`menu-item ${isActive('inicio') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="menu-icon" />
              <span>Inicio</span>
            </Link>

            <Link
              to="inventario"
              className={`menu-item ${isActive('inventario') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <Package className="menu-icon" />
              <span>Inventario</span>
            </Link>

            <Link
              to="productos"
              className={`menu-item ${isActive('productos') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart className="menu-icon" />
              <span>Productos</span>
            </Link>

            <Link
              to="categorias"
              className={`menu-item ${isActive('categorias') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <Tag className="menu-icon" />
              <span>Categorías</span>
            </Link>


            {/* FINANZAS */}
            <div className="menu-divider" />
            <span className="menu-section-title">Finanzas</span>

            <Link
              to="balance"
              className={`menu-item ${isActive('balance') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <DollarSign className="menu-icon" />
              <span>Balance</span>
            </Link>

            <Link
              to="estadisticas"
              className={`menu-item ${isActive('estadisticas') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <LineChart className="menu-icon" />
              <span>Estadísticas</span>
            </Link>

            {/* CONTACTOS */}
            <div className="menu-divider" />
            <span className="menu-section-title">Contactos</span>

            <Link
              to="clientes"
              className={`menu-item ${isActive('clientes') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <Users className="menu-icon" />
              <span>Clientes</span>
            </Link>

            <Link
              to="proveedores"
              className={`menu-item ${isActive('proveedores') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <Truck className="menu-icon" />
              <span>Proveedores</span>
            </Link>

            {/* GESTIÓN */}
            <div className="menu-divider" />
            <span className="menu-section-title">Gestión</span>

            <Link
              to="configuracion"
              className={`menu-item ${isActive('configuracion') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <Settings className="menu-icon" />
              <span>Configuración</span>
            </Link>

          </nav>
        </div>

        <div className="logout-container">
          <button className="logout-button" onClick={handleLogout}>
            <LogOut className="menu-icon" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
