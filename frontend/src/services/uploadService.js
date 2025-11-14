import api from './api';

/**
 * Upload single file
 * @param {File} file - File to upload
 * @param {Object} metadata - Additional metadata
 * @param {Function} onUploadProgress - Progress callback
 * @returns {Promise}
 */
export const uploadSingleFile = async (file, metadata = {}, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  if (metadata.uploadedBy) {
    formData.append('uploadedBy', metadata.uploadedBy);
  }

  if (metadata.tags && metadata.tags.length > 0) {
    formData.append('tags', JSON.stringify(metadata.tags));
  }

  const response = await api.post('/uploads/single', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onUploadProgress(percentCompleted);
      }
    },
  });

  return response.data;
};

/**
 * Upload multiple files
 * @param {Array} files - Array of files to upload
 * @param {Object} metadata - Additional metadata
 * @param {Function} onUploadProgress - Progress callback
 * @returns {Promise}
 */
export const uploadMultipleFiles = async (files, metadata = {}, onUploadProgress) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file);
  });

  if (metadata.uploadedBy) {
    formData.append('uploadedBy', metadata.uploadedBy);
  }

  if (metadata.tags && metadata.tags.length > 0) {
    formData.append('tags', JSON.stringify(metadata.tags));
  }

  const response = await api.post('/uploads/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onUploadProgress(percentCompleted);
      }
    },
  });

  return response.data;
};

/**
 * Get all uploads with pagination and filters
 * @param {Object} params - Query parameters
 * @returns {Promise}
 */
export const getUploads = async (params = {}) => {
  const response = await api.get('/uploads', { params });
  return response.data;
};

/**
 * Get single upload by ID
 * @param {String} id - Upload ID
 * @returns {Promise}
 */
export const getUploadById = async (id) => {
  const response = await api.get(`/uploads/${id}`);
  return response.data;
};

/**
 * Delete upload
 * @param {String} id - Upload ID
 * @param {Boolean} deleteFromCloudinary - Whether to delete from Cloudinary
 * @returns {Promise}
 */
export const deleteUpload = async (id, deleteFromCloudinary = true) => {
  const response = await api.delete(`/uploads/${id}`, {
    data: { deleteFromCloudinary },
  });
  return response.data;
};

/**
 * Get upload statistics
 * @returns {Promise}
 */
export const getUploadStats = async () => {
  const response = await api.get('/uploads/stats');
  return response.data;
};
