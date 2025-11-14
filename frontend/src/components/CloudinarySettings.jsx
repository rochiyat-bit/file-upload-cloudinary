import { useState, useEffect } from 'react';
import { FiCloud, FiSave, FiCheck, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  getConfig,
  saveConfig,
  testConfig,
  deleteConfig
} from '../services/cloudinaryConfigService';

const CloudinarySettings = () => {
  const [formData, setFormData] = useState({
    cloudName: '',
    apiKey: '',
    apiSecret: '',
    folder: 'uploads'
  });
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [hasConfig, setHasConfig] = useState(false);
  const [configId, setConfigId] = useState(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await getConfig();
      if (response.success) {
        setFormData({
          cloudName: response.data.cloudName || '',
          apiKey: response.data.apiKey || '',
          apiSecret: '', // Don't show secret
          folder: response.data.folder || 'uploads'
        });
        setHasConfig(true);
        setConfigId(response.data.id);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Fetch config error:', error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTest = async () => {
    if (!formData.cloudName || !formData.apiKey || !formData.apiSecret) {
      toast.warning('Please fill in all Cloudinary credentials');
      return;
    }

    setTesting(true);

    try {
      const response = await testConfig({
        cloudName: formData.cloudName,
        apiKey: formData.apiKey,
        apiSecret: formData.apiSecret
      });

      if (response.success) {
        toast.success('Cloudinary credentials are valid!');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Invalid Cloudinary credentials'
      );
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cloudName || !formData.apiKey) {
      toast.warning('Cloud Name and API Key are required');
      return;
    }

    if (!hasConfig && !formData.apiSecret) {
      toast.warning('API Secret is required for new configuration');
      return;
    }

    setLoading(true);

    try {
      const configData = { ...formData };

      // If updating and no new secret provided, remove it from request
      if (hasConfig && !formData.apiSecret) {
        delete configData.apiSecret;
      }

      const response = await saveConfig(configData);

      if (response.success) {
        toast.success(
          hasConfig
            ? 'Configuration updated successfully!'
            : 'Configuration saved successfully!'
        );
        setHasConfig(true);
        setConfigId(response.data.id);
        // Clear API secret field after save
        setFormData({ ...formData, apiSecret: '' });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to save configuration'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your Cloudinary configuration?')) {
      return;
    }

    try {
      const response = await deleteConfig();
      if (response.success) {
        toast.success('Configuration deleted successfully!');
        setFormData({
          cloudName: '',
          apiKey: '',
          apiSecret: '',
          folder: 'uploads'
        });
        setHasConfig(false);
        setConfigId(null);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to delete configuration'
      );
    }
  };

  return (
    <div className="settings-section">
      <h2>Cloudinary Settings</h2>
      <p className="section-description">
        Configure your personal Cloudinary account for file uploads
      </p>

      <div className="info-box">
        <FiAlertCircle />
        <div>
          <h4>Important Information</h4>
          <ul>
            <li>You need a Cloudinary account to upload files</li>
            <li>Get your credentials from <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer">cloudinary.com</a></li>
            <li>Your API Secret is encrypted and stored securely</li>
            <li>All your uploads will use your Cloudinary account</li>
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label htmlFor="cloudName">
            <FiCloud /> Cloud Name *
          </label>
          <input
            type="text"
            id="cloudName"
            name="cloudName"
            value={formData.cloudName}
            onChange={handleChange}
            placeholder="your-cloud-name"
            required
          />
          <small>Your Cloudinary cloud name</small>
        </div>

        <div className="form-group">
          <label htmlFor="apiKey">API Key *</label>
          <input
            type="text"
            id="apiKey"
            name="apiKey"
            value={formData.apiKey}
            onChange={handleChange}
            placeholder="123456789012345"
            required
          />
          <small>Your Cloudinary API key</small>
        </div>

        <div className="form-group">
          <label htmlFor="apiSecret">
            API Secret {hasConfig && '(Leave empty to keep current)'}
          </label>
          <input
            type="password"
            id="apiSecret"
            name="apiSecret"
            value={formData.apiSecret}
            onChange={handleChange}
            placeholder={hasConfig ? 'Enter new secret or leave empty' : 'Your API secret'}
            required={!hasConfig}
          />
          <small>
            Your Cloudinary API secret - will be encrypted
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="folder">Upload Folder</label>
          <input
            type="text"
            id="folder"
            name="folder"
            value={formData.folder}
            onChange={handleChange}
            placeholder="uploads"
          />
          <small>Default folder for your uploads</small>
        </div>

        <div className="button-group">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleTest}
            disabled={testing || loading}
          >
            <FiCheck /> {testing ? 'Testing...' : 'Test Connection'}
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || testing}
          >
            <FiSave /> {loading ? 'Saving...' : 'Save Configuration'}
          </button>

          {hasConfig && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={loading || testing}
            >
              <FiTrash2 /> Delete
            </button>
          )}
        </div>
      </form>

      {hasConfig && (
        <div className="success-box">
          <FiCheck />
          <p>Cloudinary configuration is active and ready to use!</p>
        </div>
      )}
    </div>
  );
};

export default CloudinarySettings;
