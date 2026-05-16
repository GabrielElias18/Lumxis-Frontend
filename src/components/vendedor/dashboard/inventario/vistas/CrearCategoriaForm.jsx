import React, { useState } from 'react';
import { X, Tag } from 'lucide-react';
import Swal from 'sweetalert2';
import './styles/CrearCategoriaForm.css';
import { createCategory } from '../../../../../services/categoryServices';

function CrearCategoriaForm({ isVisible, onClose }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cargando, setCargando] = useState(false);

  if (!isVisible) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCargando(true);
    try {
      const token = localStorage.getItem('token');
      await createCategory({ nombre, descripcion }, token);
      Swal.fire({
        title: '¡Categoría creada!',
        text: 'La categoría se registró correctamente.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#1565C0',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => window.location.reload());
      setNombre('');
      setDescripcion('');
      onClose();
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al crear la categoría.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <div className="popup-header-left">
            <Tag size={15} className="popup-header-icon" />
            <h2>Nueva Categoría</h2>
          </div>
          <button type="button" className="popup-close" onClick={onClose} aria-label="Cerrar">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="popup-body">
          <div className="form-group">
            <label htmlFor="categoriaNombre">Nombre <span className="required">*</span></label>
            <input
              type="text"
              id="categoriaNombre"
              placeholder="Ej: Bebidas, Lácteos, Electrodomésticos..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoriaDescripcion">Descripción</label>
            <input
              type="text"
              id="categoriaDescripcion"
              placeholder="Describe brevemente esta categoría"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className="form-buttons">
            <button type="button" onClick={onClose} disabled={cargando}>
              Cancelar
            </button>
            <button type="submit" disabled={cargando}>
              {cargando ? <><span className="btn-spinner" />Guardando...</> : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearCategoriaForm;
