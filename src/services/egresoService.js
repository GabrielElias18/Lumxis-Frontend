import axiosInstance from '../api/axiosConfig';

export const getEgresos = async (token) => {
  try {
    const response = await axiosInstance.get('/api/egresos', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al obtener los egresos.' };
  }
};

export const updateEgreso = async (id, data, token) => {
  try {
    const response = await axiosInstance.patch(`/api/egresos/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al actualizar el egreso.' };
  }
};

export const getEgresoById = async (id, token) => {
  try {
    const response = await axiosInstance.get(`/api/egresos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al obtener el egreso.' };
  }
};

// Mantenemos este nombre por compatibilidad con los formularios existentes, pero usa el endpoint unificado
export const createEgresoBatch = async (items, proveedorid, token, descripcion = '') => {
  try {
    const response = await axiosInstance.post('/api/egresos', { items, proveedorid, descripcion }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al registrar el egreso.' };
  }
};

export const deleteEgreso = async (id, token) => {
  try {
    const response = await axiosInstance.delete(`/api/egresos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al eliminar el egreso.' };
  }
};
