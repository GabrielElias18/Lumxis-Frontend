import axiosInstance from '../api/axiosConfig';

export const createCategory = async (categoria, token) => {
  try {
    const response = await axiosInstance.post('/api/categorias', categoria, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error de conexión con el servidor.' };
  }
};

export const getCategoriesByUser = async (token) => {
  try {
    const response = await axiosInstance.get('/api/categorias', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error de conexión con el servidor.' };
  }
};

export const updateCategory = async (id, updatedCategoria, token) => {
  try {
    const response = await axiosInstance.put(`/api/categorias/${id}`, updatedCategoria, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error de conexión con el servidor.' };
  }
};

export const deleteCategory = async (id, token) => {
  try {
    const response = await axiosInstance.delete(`/api/categorias/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error de conexión con el servidor.' };
  }
};
