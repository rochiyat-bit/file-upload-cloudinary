import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { uploadSingleFile, uploadMultipleFiles } from '../services/uploadService';

const FileUpload = ({ onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'],
      'video/*': ['.mp4', '.mpeg', '.mov'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  });

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.warning('Please select files to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let result;
      if (selectedFiles.length === 1) {
        result = await uploadSingleFile(
          selectedFiles[0],
          {},
          setUploadProgress
        );
        toast.success('File uploaded successfully!');
      } else {
        result = await uploadMultipleFiles(
          selectedFiles,
          {},
          setUploadProgress
        );
        toast.success(`${selectedFiles.length} files uploaded successfully!`);
      }

      setSelectedFiles([]);
      setUploadProgress(0);

      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to upload files'
      );
    } finally {
      setUploading(false);
    }
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setUploadProgress(0);
  };

  return (
    <div className="upload-section">
      <h2 className="section-title">
        <FiUploadCloud />
        Upload Files
      </h2>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-content">
          <FiUploadCloud className="dropzone-icon" />
          <div className="dropzone-text">
            <h3>
              {isDragActive
                ? 'Drop files here'
                : 'Drag & drop files here'}
            </h3>
            <p>or click to select files</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
              Supported: Images, Videos, PDF, Documents (Max 10MB each)
            </p>
          </div>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="file-preview">
          <h3>Selected Files ({selectedFiles.length})</h3>
          <div className="file-list">
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-item">
                <FiFile className="file-item-icon" />
                <div className="file-item-info">
                  <div className="file-item-name">{file.name}</div>
                  <div className="file-item-size">
                    {formatFileSize(file.size)}
                  </div>
                </div>
                <button
                  className="file-item-remove"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>

          {uploading && (
            <div className="upload-progress">
              <p>Uploading... {uploadProgress}%</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="upload-actions">
            <button
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={uploading}
            >
              <FiUploadCloud />
              {uploading ? 'Uploading...' : 'Upload Files'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={clearFiles}
              disabled={uploading}
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
