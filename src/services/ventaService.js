import axiosInstance from '../api/axiosConfig';

export const getVentas = async (token) => {
  try {
    const response = await axiosInstance.get('/api/ventas', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al obtener las ventas.' };
  }
};

export const updateVenta = async (id, data, token) => {
  try {
    const response = await axiosInstance.patch(`/api/ventas/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al actualizar la venta.' };
  }
};

export const getVentaById = async (id, token) => {
  try {
    const response = await axiosInstance.get(`/api/ventas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al obtener la venta.' };
  }
};

// Mantenemos este nombre por compatibilidad con los formularios existentes, pero usa el endpoint unificado
export const createVentaBatch = async (items, clienteid, token, descripcion = '') => {
  try {
    const response = await axiosInstance.post('/api/ventas', { items, clienteid, descripcion }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al registrar la venta.' };
  }
};

export const deleteVenta = async (id, token) => {
  try {
    const response = await axiosInstance.delete(`/api/ventas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al eliminar la venta.' };
  }
};
