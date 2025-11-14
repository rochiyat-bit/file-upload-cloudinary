import api from './api';

/**
 * Get user's cloudinary config
 */
export const getConfig = async () => {
  const response = await api.get('/cloudinary-config');
  return response.data;
};

/**
 * Save cloudinary config
 */
export const saveConfig = async (configData) => {
  const response = await api.post('/cloudinary-config', configData);
  return response.data;
};

/**
 * Test cloudinary credentials
 */
export const testConfig = async (configData) => {
  const response = await api.post('/cloudinary-config/test', configData);
  return response.data;
};

/**
 * Delete cloudinary config
 */
export const deleteConfig = async () => {
  const response = await api.delete('/cloudinary-config');
  return response.data;
};

/**
 * Toggle config status
 */
export const toggleConfig = async () => {
  const response = await api.patch('/cloudinary-config/toggle');
  return response.data;
};
