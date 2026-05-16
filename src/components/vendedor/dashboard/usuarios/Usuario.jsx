import { useState, useEffect } from 'react';
import { User, Mail, Phone, Edit2, Shield } from 'lucide-react';
import Swal from 'sweetalert2';
import axiosInstance from '../../../../api/axiosConfig';
import './Usuarios.css';

const Personal = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    primerNombre: '',
    primerApellido: '',
    correo: '',
    telefono: '',
    contraseña: '',
  });

  useEffect(() => {
    axiosInstance
      .get('/api/usuarios')
      .then((res) => setUsuario((res.data.usuarios || [])[0] ?? null))
      .catch(() => Swal.fire('Error', 'No se pudo cargar la información.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const abrirEditar = () => {
    setForm({
      primerNombre: usuario.primer_nombre || '',
      primerApellido: usuario.primer_apellido || '',
      correo: usuario.correo || '',
      telefono: usuario.telefono || '',
      contraseña: '',
    });
    setMostrarModal(true);
  };

  const cerrarModal = () => setMostrarModal(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await axiosInstance.put(`/api/usuarios/${usuario.usuarioid}`, form);
      setUsuario((prev) => ({
        ...prev,
        primer_nombre: form.primerNombre,
        primer_apellido: form.primerApellido,
        correo: form.correo,
        telefono: form.telefono,
      }));
      cerrarModal();
      Swal.fire({ title: 'Actualizado', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire('Error', 'No se pudo actualizar la información.', 'error');
    } finally {
      setGuardando(false);
    }
  };

  const iniciales = usuario
    ? `${usuario.primer_nombre?.[0] || ''}${usuario.primer_apellido?.[0] || ''}`.toUpperCase()
    : '';

  if (loading) {
    return (
      <div className="personal-loading">
        <div className="personal-spinner" />
      </div>
    );
  }

  return (
    <div className="personal-view">
      <div className="personal-header">
        <div className="personal-header-icon">
          <User size={20} />
        </div>
        <div className="personal-header-text">
          <h1>Personal</h1>
          <p>Información del administrador del negocio</p>
        </div>
      </div>

      {usuario && (
        <div className="personal-card">
          <div className="personal-card-top">
            <div className="personal-avatar">{iniciales}</div>
            <div className="personal-card-info">
              <div className="personal-nombre">
                {usuario.primer_nombre} {usuario.primer_apellido}
              </div>
              <span className="personal-role-badge">
                <Shield size={10} />
                Administrador
              </span>
            </div>
            <button className="personal-btn-edit" onClick={abrirEditar}>
              <Edit2 size={13} />
              <span>Editar</span>
            </button>
          </div>

          <div className="personal-divider" />

          <div className="personal-fields">
            <div className="personal-field">
              <span className="personal-field-label">
                <Mail size={12} /> Correo
              </span>
              <span className="personal-field-value">{usuario.correo}</span>
            </div>
            <div className="personal-field">
              <span className="personal-field-label">
                <Phone size={12} /> Teléfono
              </span>
              <span className="personal-field-value">{usuario.telefono || '—'}</span>
            </div>
          </div>
        </div>
      )}

      {mostrarModal && (
        <div className="personal-overlay" onClick={cerrarModal}>
          <div className="personal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="personal-modal-header">
              <h3>Editar perfil</h3>
              <button className="personal-modal-close" onClick={cerrarModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="personal-form">
              <div className="personal-form-row">
                <div className="personal-form-group">
                  <label>Nombre *</label>
                  <input
                    name="primerNombre"
                    value={form.primerNombre}
                    onChange={handleChange}
                    required
                    placeholder="Nombre"
                  />
                </div>
                <div className="personal-form-group">
                  <label>Apellido *</label>
                  <input
                    name="primerApellido"
                    value={form.primerApellido}
                    onChange={handleChange}
                    required
                    placeholder="Apellido"
                  />
                </div>
              </div>
              <div className="personal-form-row">
                <div className="personal-form-group">
                  <label>Correo *</label>
                  <input
                    name="correo"
                    type="email"
                    value={form.correo}
                    onChange={handleChange}
                    required
                    placeholder="correo@email.com"
                  />
                </div>
                <div className="personal-form-group">
                  <label>Teléfono</label>
                  <input
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="3001234567"
                  />
                </div>
              </div>
              <div className="personal-form-group">
                <label>
                  Nueva contraseña
                  <span className="personal-label-hint"> (dejar vacío para no cambiar)</span>
                </label>
                <input
                  name="contraseña"
                  type="password"
                  value={form.contraseña}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>
              <div className="personal-form-actions">
                <button type="button" className="personal-btn-cancelar" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="personal-btn-guardar" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personal;
