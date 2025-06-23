import axios from 'axios';

const API_URL = 'http://localhost:3000/api/productos'; // Cambia la URL si es necesario

// Crear un producto
export const createProduct = async (producto, token) => {
  try {
    const response = await axios.post(
      API_URL,
      producto,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al crear el producto.' };
  }
};


// Obtener todos los productos de un usuario
export const getAllProducts = async (token) => {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Obtener un producto por su ID
export const getProductById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Actualizar un producto
export const updateProduct = async (id, updatedProduct, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedProduct, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Eliminar un producto
export const deleteProduct = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
