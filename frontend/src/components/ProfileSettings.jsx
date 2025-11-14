import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from '../services/authService';

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await updateProfile(formData);
      if (response.success) {
        updateUser(response.data);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="settings-section">
      <h2>Profile Settings</h2>
      <p className="section-description">Update your personal information</p>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label>
            <FiMail /> Email
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="input-disabled"
          />
          <small>Email cannot be changed</small>
        </div>

        <div className="form-group">
          <label>
            <FiUser /> Username
          </label>
          <input
            type="text"
            value={user.username}
            disabled
            className="input-disabled"
          />
          <small>Username cannot be changed</small>
        </div>

        <div className="form-group">
          <label htmlFor="fullName">
            <FiUser /> Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="avatar">Avatar URL</label>
          <input
            type="url"
            id="avatar"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
          />
          {formData.avatar && (
            <div className="avatar-preview">
              <img src={formData.avatar} alt="Avatar preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Role</label>
          <input
            type="text"
            value={user.role}
            disabled
            className="input-disabled"
          />
          <small>Your account role</small>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
