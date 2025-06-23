import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Importamos SweetAlert2
import './styles/GestionarCategoriaForm.css';
import { getCategoriesByUser, updateCategory, deleteCategory } from '../../../../../services/categoryServices';

function GestionarCategoriaForm({ isVisible, onClose }) {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCategoria, setEditedCategoria] = useState({
    nombre: '',
    descripcion: '',
  });

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem('token');
        const categoriasData = await getCategoriesByUser(token);
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    if (isVisible) {
      fetchCategorias();
    }
  }, [isVisible]);

  const handleSelectChange = (event) => {
    const categoriaId = event.target.value;
    const categoria = categorias.find((cat) => cat.categoriaid == categoriaId);
    if (categoria) {
      setCategoriaSeleccionada(categoria);
      setEditedCategoria({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
      });
    }
  };
  

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (categoriaSeleccionada) {
      try {
        const token = localStorage.getItem('token');
        const updatedCategoria = { ...categoriaSeleccionada, ...editedCategoria };
        await updateCategory(categoriaSeleccionada.categoriaid, updatedCategoria, token);
        
        setCategorias(categorias.map((cat) =>
          cat.categoriaid === categoriaSeleccionada.categoriaid ? updatedCategoria : cat
        ));
        setCategoriaSeleccionada(updatedCategoria);
        setIsEditing(false);

        // Alerta con SweetAlert2
        Swal.fire({
          title: '¡Éxito!',
          text: 'Categoría actualizada con éxito',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          window.location.reload(); // Recargamos la página después de la alerta
        });

      } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al actualizar la categoría',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    }
  };

  const handleDelete = async () => {
    if (categoriaSeleccionada) {
      try {
        const token = localStorage.getItem('token');

        // Confirmación antes de eliminar
        const confirmacion = await Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción eliminará la categoría permanentemente.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
        });

        if (!confirmacion.isConfirmed) return;

        await deleteCategory(categoriaSeleccionada.categoriaid, token);

        setCategorias(categorias.filter((cat) => cat.categoriaid !== categoriaSeleccionada.categoriaid));
        setCategoriaSeleccionada(null);
        setIsEditing(false);

        Swal.fire({
          title: '¡Eliminado!',
          text: 'La categoría se eliminó correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          window.location.reload();
        });

      } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al eliminar la categoría',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedCategoria({
      ...editedCategoria,
      [name]: value,
    });
  };

  if (!isVisible) return null;

  return (
    <div className="overlay">
      <div className="popup">
        <h2>Gestionar Categorías</h2>
        <form>
          <div className="form-group">
            <label htmlFor="selectCategoria">Selecciona una Categoría</label>
            <select
              id="selectCategoria"
              onChange={handleSelectChange}
              value={categoriaSeleccionada ? categoriaSeleccionada.categoriaid : ""}
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {categorias.map((categoria) => (
                <option key={categoria.categoriaid} value={categoria.categoriaid}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          {categoriaSeleccionada && (
            <div className="categoria-detalles">
              <div className="detalle">
                <strong>Nombre:</strong>
                {isEditing ? (
                  <input
                    type="text"
                    name="nombre"
                    value={editedCategoria.nombre}
                    onChange={handleInputChange}
                  />
                ) : (
                  categoriaSeleccionada.nombre
                )}
              </div>
              <div className="detalle">
                <strong>Descripción:</strong>
                {isEditing ? (
                  <input
                    type="text"
                    name="descripcion"
                    value={editedCategoria.descripcion}
                    onChange={handleInputChange}
                  />
                ) : (
                  categoriaSeleccionada.descripcion
                )}
              </div>
            </div>
          )}

          <div className="form-buttons">
            {isEditing ? (
              <button className="guardar-button" type="button" onClick={handleSave}>
                Guardar
              </button>
            ) : (
              <button className="guardar-button" type="button" onClick={handleEdit}>
                Editar
              </button>
            )}
            <button className="eliminar-button" type="button" onClick={handleDelete}>
              Eliminar
            </button>
            <button type="button" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GestionarCategoriaForm;
