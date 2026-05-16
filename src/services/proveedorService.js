import axiosInstance from '../api/axiosConfig';

export const createProveedor = async (proveedor, token) => {
  try {
    const response = await axiosInstance.post('/api/proveedores', proveedor, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al registrar el proveedor.' };
  }
};

export const getProveedores = async (token) => {
  try {
    const response = await axiosInstance.get('/api/proveedores', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al obtener los proveedores.' };
  }
};

export const updateProveedor = async (id, proveedor, token) => {
  try {
    const response = await axiosInstance.patch(`/api/proveedores/${id}`, proveedor, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al actualizar el proveedor.' };
  }
};

export const deleteProveedor = async (id, token) => {
  try {
    const response = await axiosInstance.delete(`/api/proveedores/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al eliminar el proveedor.' };
  }
};
