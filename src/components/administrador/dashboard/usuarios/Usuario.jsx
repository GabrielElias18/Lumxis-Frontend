import React, { useState } from "react";
import "./Usuarios.css";

const Usuarios = () => {
  const [busqueda, setBusqueda] = useState("");
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan@example.com",
      rol: "Administrador",
      foto: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      nombre: "María López",
      email: "maria@example.com",
      rol: "Usuario",
      foto: "https://randomuser.me/api/portraits/women/2.jpg",
    },
  ]);

  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoEmail, setNuevoEmail] = useState("");

  const abrirModalEdicion = (usuario) => {
    setUsuarioEditando(usuario);
    setNuevoNombre(usuario.nombre);
    setNuevoEmail(usuario.email);
  };

  const guardarEdicion = () => {
    setUsuarios(
      usuarios.map((user) =>
        user.id === usuarioEditando.id
          ? { ...user, nombre: nuevoNombre, email: nuevoEmail }
          : user
      )
    );
    setUsuarioEditando(null);
  };

  const eliminarUsuario = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      setUsuarios(usuarios.filter((user) => user.id !== id));
    }
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="contenedor-usuarios">
      <div className="barra-superior">
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-busqueda"
        />
        <button className="boton-crear">+ Nuevo Usuario</button>
      </div>

      <h2 className="titulo-seccion">Usuarios Registrados</h2>

      <div className="lista-usuarios">
        {usuariosFiltrados.map((usuario) => (
          <div key={usuario.id} className="tarjeta-usuario">
            <img src={usuario.foto} alt={usuario.nombre} className="avatar" />
            <div className="info-usuario">
              <h3>{usuario.nombre}</h3>
              <p>{usuario.email}</p>
              <span className={`rol ${usuario.rol === "Administrador" ? "admin" : "usuario"}`}>
                {usuario.rol}
              </span>
            </div>
            <div className="acciones">
              <button onClick={() => abrirModalEdicion(usuario)} className="boton-editar">
                Editar
              </button>
              <button onClick={() => eliminarUsuario(usuario.id)} className="boton-eliminar">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {usuarioEditando && (
        <div className="modal">
          <div className="modal-contenido">
            <h3>Editar Usuario</h3>
            <input
              type="text"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
            />
            <input
              type="email"
              value={nuevoEmail}
              onChange={(e) => setNuevoEmail(e.target.value)}
            />
            <div className="modal-acciones">
              <button onClick={guardarEdicion} className="boton-guardar">
                Guardar
              </button>
              <button onClick={() => setUsuarioEditando(null)} className="boton-cancelar">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
