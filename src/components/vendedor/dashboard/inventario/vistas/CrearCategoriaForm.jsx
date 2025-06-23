import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import './styles/CrearCategoriaForm.css';
import { createCategory } from '../../../../../services/categoryServices'; // Importa el servicio

function CrearCategoriaForm({ isVisible, onClose }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  if (!isVisible) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Obtiene el token
      const nuevaCategoria = { nombre, descripcion };

      await createCategory(nuevaCategoria, token);

      // Muestra la alerta de éxito
      Swal.fire({
        title: '¡Éxito!',
        text: 'Categoría creada satisfactoriamente.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        window.location.reload(); // Recarga la página después de la alerta
      });

      setNombre('');
      setDescripcion('');
      onClose(); // Cierra el popup después de crear la categoría
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      
      // Muestra una alerta de error si falla
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al crear la categoría.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="overlay">
      <div className="popup">
        <h2>Crear Nueva Categoría</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="categoriaNombre">Nombre de la Categoría</label>
            <input
              type="text"
              id="categoriaNombre"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="categoriaDescripcion">Descripción de la Categoría</label>
            <input
              type="text"
              id="categoriaDescripcion"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
          <div className="form-buttons">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearCategoriaForm;
