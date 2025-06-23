import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Users, FileText, Settings, LogOut, Menu, X } from "lucide-react";
import Swal from "sweetalert2";
import "./styles/SidebarAdmin.css";

function SidebarAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión se cerrará y deberás iniciar sesión nuevamente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        Swal.fire({
          title: "Sesión cerrada",
          text: "Has cerrado sesión exitosamente.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/");
        });
      }
    });
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="menu-toggle" onClick={toggleMenu}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo-container">
          <div className="logo">
            <Users className="logo-icon" />
            <span className="logo-text">Admin Panel</span>
          </div>
        </div>

        <div className="menu-container">
          <nav className="menu-items">
            <h3 className="menu-title">Administración</h3>

            <Link
              to="usuarios"
              className={`menu-item ${location.pathname.includes("usuarios") ? "active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <Users className="menu-icon" />
              <span>Gestión de Usuarios</span>
            </Link>

            <Link
              to="reportes"
              className={`menu-item ${location.pathname.includes("reportes") ? "active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <FileText className="menu-icon" />
              <span>Reportes</span>
            </Link>

            <Link
              to="configuracion"
              className={`menu-item ${location.pathname.includes("configuracion") ? "active" : ""}`}
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

export default SidebarAdmin;
