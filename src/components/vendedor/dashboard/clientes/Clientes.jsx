import React, { useState, useEffect } from 'react';
import { Plus, Users, Search, Edit2, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { getClientes, createCliente, updateCliente, deleteCliente } from '../../../../services/clienteService';
import './clientes.css';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState(() => localStorage.getItem("cliSearchTerm") || "");
  const [paginaActual, setPaginaActual] = useState(() => parseInt(localStorage.getItem("cliCurrentPage")) || 1);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [form, setForm] = useState({ nombreCliente: '', telefono: '', correo: '', direccion: '' });
  const [cargando, setCargando] = useState(false);
  const registrosPorPagina = 12;

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const data = await getClientes(token);
      setClientes(data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const handleSetBusqueda = (val) => {
    setBusqueda(val);
    setPaginaActual(1);
    localStorage.setItem("cliSearchTerm", val);
    localStorage.setItem("cliCurrentPage", 1);
  };

  const handleSetPagina = (val) => {
    setPaginaActual(val);
    localStorage.setItem("cliCurrentPage", val);
  };

  const abrirCrear = () => {
    setClienteEditando(null);
    setForm({ nombreCliente: '', telefono: '', correo: '', direccion: '' });
    setMostrarModal(true);
  };

  const abrirEditar = (cliente) => {
    setClienteEditando(cliente);
    setForm({
      nombreCliente: cliente.nombreCliente,
      telefono: cliente.telefono,
      correo: cliente.correo,
      direccion: cliente.direccion,
    });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setClienteEditando(null);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      if (clienteEditando) {
        await updateCliente(clienteEditando.clienteid, form, token);
        Swal.fire({ title: 'Actualizado', text: 'Cliente actualizado.', icon: 'success', timer: 1800, showConfirmButton: false });
      } else {
        await createCliente(form, token);
        Swal.fire({ title: 'Creado', text: 'Cliente registrado.', icon: 'success', timer: 1800, showConfirmButton: false });
      }
      await fetchClientes();
      cerrarModal();
    } catch (error) {
      Swal.fire({ title: 'Error', text: error.mensaje || 'Error al guardar.', icon: 'error' });
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id, nombre) => {
    const result = await Swal.fire({
      title: `¿Eliminar a ${nombre}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      try {
        await deleteCliente(id, token);
        setClientes((prev) => prev.filter((c) => c.clienteid !== id));
        Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1500, showConfirmButton: false });
      } catch (error) {
        Swal.fire({ title: 'Error', text: 'No se pudo eliminar el cliente.', icon: 'error' });
      }
    }
  };

  const clientesFiltrados = clientes.filter((c) =>
    c.nombreCliente?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.correo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.telefono?.includes(busqueda)
  );

  const total = Math.ceil(clientesFiltrados.length / registrosPorPagina);
  const inicio = (paginaActual - 1) * registrosPorPagina;
  const pagina = clientesFiltrados.slice(inicio, inicio + registrosPorPagina);

  return (
    <div className="clientes-main">
      <div className="clientes-header">
        <div className="clientes-header-left">
          <Users size={18} className="clientes-header-icon" />
          <h2 className="clientes-titulo">Clientes</h2>
          <span className="clientes-badge">{clientes.length}</span>
        </div>
        <button className="clientes-btn-nuevo" onClick={abrirCrear}>
          <Plus size={14} />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      <div className="clientes-search-wrap">
        <Search size={14} className="clientes-search-icon" />
        <input
          type="text"
          className="clientes-search"
          placeholder="Buscar por nombre, correo o teléfono..."
          value={busqueda}
          onChange={(e) => handleSetBusqueda(e.target.value)}
        />
      </div>

      <div className="clientes-table-wrap">
        <table className="clientes-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagina.length > 0 ? pagina.map((c) => (
              <tr key={c.clienteid}>
                <td className="clientes-td-nombre">{c.nombreCliente}</td>
                <td>{c.telefono}</td>
                <td>{c.correo}</td>
                <td>{c.direccion}</td>
                <td className="clientes-td-acciones">
                  <button className="clientes-btn-edit" onClick={() => abrirEditar(c)}><Edit2 size={13} /></button>
                  <button className="clientes-btn-del" onClick={() => handleEliminar(c.clienteid, c.nombreCliente)}><Trash2 size={13} /></button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="clientes-empty">
                  <Users size={28} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                  <p>No se encontraron clientes</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {total > 1 && (
        <div className="clientes-paginacion">
          <button onClick={() => handleSetPagina(paginaActual - 1)} disabled={paginaActual === 1}>Anterior</button>
          <span>Página {paginaActual} de {total}</span>
          <button onClick={() => handleSetPagina(paginaActual + 1)} disabled={paginaActual === total}>Siguiente</button>
        </div>
      )}

      {mostrarModal && (
        <div className="clientes-overlay" onClick={cerrarModal}>
          <div className="clientes-modal" onClick={(e) => e.stopPropagation()}>
            <div className="clientes-modal-header">
              <h3>{clienteEditando ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
              <button className="clientes-modal-close" onClick={cerrarModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="clientes-form">
              <div className="clientes-form-group">
                <label>Nombre del cliente *</label>
                <input name="nombreCliente" value={form.nombreCliente} onChange={handleChange} required placeholder="Nombre completo" />
              </div>
              <div className="clientes-form-row">
                <div className="clientes-form-group">
                  <label>Teléfono *</label>
                  <input name="telefono" value={form.telefono} onChange={handleChange} required placeholder="3001234567" />
                </div>
                <div className="clientes-form-group">
                  <label>Correo *</label>
                  <input name="correo" type="email" value={form.correo} onChange={handleChange} required placeholder="correo@email.com" />
                </div>
              </div>
              <div className="clientes-form-group">
                <label>Dirección *</label>
                <input name="direccion" value={form.direccion} onChange={handleChange} required placeholder="Dirección" />
              </div>
              <div className="clientes-form-actions">
                <button type="button" className="clientes-btn-cancelar" onClick={cerrarModal}>Cancelar</button>
                <button type="submit" className="clientes-btn-guardar" disabled={cargando}>
                  {cargando ? 'Guardando...' : clienteEditando ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clientes;
