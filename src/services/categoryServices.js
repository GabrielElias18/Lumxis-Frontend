import axios from 'axios';

const API_URL = 'http://localhost:3000/api/categorias'; // Cambia la URL si es necesario

// Crear una nueva categoría
export const createCategory = async (categoria, token) => {
  try {
    const response = await axios.post(`${API_URL}`, categoria, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Obtener las categorías de un usuario
export const getCategoriesByUser = async (token) => {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.categorias;
  } catch (error) {
    throw error.response.data;
  }
};

// Editar una categoría
export const updateCategory = async (id, updatedCategoria, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedCategoria, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Eliminar una categoría
export const deleteCategory = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
