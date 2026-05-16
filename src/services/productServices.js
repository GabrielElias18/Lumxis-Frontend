import axiosInstance from '../api/axiosConfig';

export const createProduct = async (producto, token) => {
  try {
    const response = await axiosInstance.post('/api/productos', producto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al crear el producto.' };
  }
};

export const getAllProducts = async (token) => {
  try {
    const response = await axiosInstance.get('/api/productos', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al obtener los productos.' };
  }
};

export const getProductById = async (id, token) => {
  try {
    const response = await axiosInstance.get(`/api/productos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al obtener el producto.' };
  }
};

export const updateProduct = async (id, updatedProduct, token) => {
  try {
    const response = await axiosInstance.put(`/api/productos/${id}`, updatedProduct, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al actualizar el producto.' };
  }
};

export const deleteProduct = async (id, token) => {
  try {
    const response = await axiosInstance.delete(`/api/productos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al eliminar el producto.' };
  }
};
