import axiosInstance from '../api/axiosConfig';

export const getDashboardStats = async (token, year) => {
  const response = await axiosInstance.get('/api/stats/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
    params: { year }
  });
  return response.data;
};
