import { useState, useEffect } from 'react';
import {
  FiImage,
  FiEye,
  FiTrash2,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiFile,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getUploads, deleteUpload } from '../services/uploadService';

const FileGallery = ({ refreshTrigger }) => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });
  const [filters, setFilters] = useState({
    search: '',
    resourceType: '',
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  useEffect(() => {
    fetchUploads();
  }, [pagination.currentPage, filters, refreshTrigger]);

  const fetchUploads = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...filters,
      };

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (params[key] === '') {
          delete params[key];
        }
      });

      const response = await getUploads(params);

      if (response.success) {
        setUploads(response.data.uploads);
        setPagination((prev) => ({
          ...prev,
          ...response.data.pagination,
        }));
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch uploads');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, filename) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }

    try {
      const response = await deleteUpload(id, true);
      if (response.success) {
        toast.success('File deleted successfully');
        fetchUploads();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isImage = (mimeType) => {
    return mimeType && mimeType.startsWith('image/');
  };

  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="gallery-section">
      <h2 className="section-title">
        <FiImage />
        Uploaded Files
      </h2>

      <div className="gallery-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search files..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        <select
          className="filter-select"
          value={filters.resourceType}
          onChange={(e) => handleFilterChange('resourceType', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="raw">Documents</option>
        </select>

        <select
          className="filter-select"
          value={filters.sortOrder}
          onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
        >
          <option value="DESC">Newest First</option>
          <option value="ASC">Oldest First</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading files...</p>
        </div>
      ) : uploads.length === 0 ? (
        <div className="empty-state">
          <FiImage />
          <h3>No files uploaded yet</h3>
          <p>Upload your first file to get started</p>
        </div>
      ) : (
        <>
          <div className="gallery-grid">
            {uploads.map((upload) => (
              <div key={upload.id} className="gallery-item">
                {isImage(upload.mimeType) ? (
                  <div className="gallery-item-image">
                    <img
                      src={upload.cloudinarySecureUrl}
                      alt={upload.originalName}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="gallery-item-placeholder">
                    <FiFile />
                  </div>
                )}

                <div className="gallery-item-info">
                  <div
                    className="gallery-item-name"
                    title={upload.originalName}
                  >
                    {upload.originalName}
                  </div>

                  <div className="gallery-item-meta">
                    <span>{formatFileSize(upload.size)}</span>
                    <span>{formatDate(upload.createdAt)}</span>
                  </div>

                  <div className="gallery-item-actions">
                    <button
                      className="btn-icon btn-view"
                      onClick={() => openInNewTab(upload.cloudinarySecureUrl)}
                      title="View file"
                    >
                      <FiEye />
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() =>
                        handleDelete(upload.id, upload.originalName)
                      }
                      title="Delete file"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <div className="pagination-info">
                Page {pagination.currentPage} of {pagination.totalPages} (
                {pagination.totalItems} total)
              </div>
              <div className="pagination-buttons">
                <button
                  className="btn-page"
                  onClick={() =>
                    handlePageChange(pagination.currentPage - 1)
                  }
                  disabled={!pagination.hasPrevPage}
                >
                  <FiChevronLeft />
                </button>
                <button
                  className="btn-page"
                  onClick={() =>
                    handlePageChange(pagination.currentPage + 1)
                  }
                  disabled={!pagination.hasNextPage}
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FileGallery;
