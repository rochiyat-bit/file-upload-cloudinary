import api from './api';

/**
 * Get all users (admin/moderator)
 */
export const getAllUsers = async (params = {}) => {
  const response = await api.get('/users', { params });
  return response.data;
};

/**
 * Get user by ID (admin/moderator)
 */
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

/**
 * Create new user (admin)
 */
export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

/**
 * Update user (admin/moderator)
 */
export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

/**
 * Delete user (admin)
 */
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

/**
 * Get user statistics (admin)
 */
export const getUserStats = async () => {
  const response = await api.get('/users/stats');
  return response.data;
};
