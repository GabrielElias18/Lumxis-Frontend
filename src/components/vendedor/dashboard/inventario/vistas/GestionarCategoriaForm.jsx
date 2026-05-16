import React, { useState, useEffect } from 'react';
import { X, Tag, Pencil, Check, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import './styles/GestionarCategoriaForm.css';
import { getCategoriesByUser, updateCategory, deleteCategory } from '../../../../../services/categoryServices';

function GestionarCategoriaForm({ isVisible, onClose }) {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCategoria, setEditedCategoria] = useState({ nombre: '', descripcion: '' });
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getCategoriesByUser(token);
        setCategorias(data);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };
    if (isVisible) fetchCategorias();
  }, [isVisible]);

  const handleSelectChange = (event) => {
    const categoria = categorias.find((cat) => String(cat.categoriaid) === String(event.target.value));
    if (categoria) {
      setCategoriaSeleccionada(categoria);
      setEditedCategoria({ nombre: categoria.nombre, descripcion: categoria.descripcion });
      setIsEditing(false);
    }
  };

  const handleSave = async () => {
    if (!categoriaSeleccionada) return;
    setCargando(true);
    try {
      const token = localStorage.getItem('token');
      const updated = { ...categoriaSeleccionada, ...editedCategoria };
      await updateCategory(categoriaSeleccionada.categoriaid, updated, token);
      setCategorias(categorias.map((c) => c.categoriaid === categoriaSeleccionada.categoriaid ? updated : c));
      setCategoriaSeleccionada(updated);
      setIsEditing(false);
      Swal.fire({ title: '¡Actualizado!', text: 'Categoría actualizada con éxito.', icon: 'success', timer: 1800, showConfirmButton: false })
        .then(() => window.location.reload());
    } catch (error) {
      Swal.fire({ title: 'Error', text: 'Hubo un problema al actualizar la categoría.', icon: 'error', confirmButtonText: 'Aceptar' });
    } finally {
      setCargando(false);
    }
  };

  const handleDelete = async () => {
    if (!categoriaSeleccionada) return;
    const result = await Swal.fire({
      title: `¿Eliminar "${categoriaSeleccionada.nombre}"?`,
      text: 'Esta acción eliminará la categoría permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;
    try {
      const token = localStorage.getItem('token');
      await deleteCategory(categoriaSeleccionada.categoriaid, token);
      setCategorias(categorias.filter((c) => c.categoriaid !== categoriaSeleccionada.categoriaid));
      setCategoriaSeleccionada(null);
      setIsEditing(false);
      Swal.fire({ title: '¡Eliminado!', text: 'La categoría se eliminó correctamente.', icon: 'success', timer: 1500, showConfirmButton: false })
        .then(() => window.location.reload());
    } catch (error) {
      Swal.fire({ title: 'Error', text: 'Hubo un problema al eliminar la categoría.', icon: 'error', confirmButtonText: 'Aceptar' });
    }
  };

  const handleInputChange = ({ target: { name, value } }) =>
    setEditedCategoria((prev) => ({ ...prev, [name]: value }));

  if (!isVisible) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <div className="popup-header-left">
            <Tag size={15} className="popup-header-icon" />
            <h2>Gestionar Categorías</h2>
          </div>
          <button type="button" className="popup-close" onClick={onClose} aria-label="Cerrar">
            <X size={16} />
          </button>
        </div>

        <div className="popup-body">
          <div className="form-group">
            <label htmlFor="selectCategoria">Selecciona una categoría</label>
            <select
              id="selectCategoria"
              onChange={handleSelectChange}
              value={categoriaSeleccionada ? categoriaSeleccionada.categoriaid : ""}
            >
              <option value="" disabled>Elige una categoría para gestionar...</option>
              {categorias.map((cat) => (
                <option key={cat.categoriaid} value={cat.categoriaid}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          {categoriaSeleccionada && (
            <div className="categoria-card">
              <div className="categoria-card-header">
                <span className="categoria-card-label">Detalles de la categoría</span>
                {!isEditing && (
                  <button type="button" className="btn-edit-inline" onClick={() => setIsEditing(true)}>
                    <Pencil size={13} />
                    Editar
                  </button>
                )}
              </div>

              <div className="form-group">
                <label>Nombre {isEditing && <span className="required">*</span>}</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="nombre"
                    value={editedCategoria.nombre}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                ) : (
                  <p className="field-value">{categoriaSeleccionada.nombre}</p>
                )}
              </div>

              <div className="form-group">
                <label>Descripción</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="descripcion"
                    value={editedCategoria.descripcion}
                    onChange={handleInputChange}
                    placeholder="Sin descripción"
                  />
                ) : (
                  <p className="field-value">{categoriaSeleccionada.descripcion || <span className="field-empty">Sin descripción</span>}</p>
                )}
              </div>
            </div>
          )}

          <div className="form-buttons">
            <button
              type="button"
              className="btn-danger"
              onClick={handleDelete}
              disabled={!categoriaSeleccionada || cargando}
              title="Eliminar categoría"
            >
              <Trash2 size={14} />
              Eliminar
            </button>

            <div className="btn-group-right">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cerrar
              </button>
              {isEditing && (
                <button type="button" className="btn-primary" onClick={handleSave} disabled={cargando}>
                  {cargando ? <><span className="btn-spinner" />Guardando...</> : <><Check size={14} />Guardar</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GestionarCategoriaForm;
