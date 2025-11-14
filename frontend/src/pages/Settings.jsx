import { useState } from 'react';
import { FiSettings, FiUser, FiCloud, FiLock } from 'react-icons/fi';
import ProfileSettings from '../components/ProfileSettings';
import CloudinarySettings from '../components/CloudinarySettings';
import PasswordSettings from '../components/PasswordSettings';
import '../styles/Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'cloudinary', label: 'Cloudinary', icon: FiCloud },
    { id: 'password', label: 'Password', icon: FiLock }
  ];

  return (
    <div className="settings-container">
      <div className="settings-header">
        <FiSettings className="settings-icon" />
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="settings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="settings-content">
        {activeTab === 'profile' && <ProfileSettings />}
        {activeTab === 'cloudinary' && <CloudinarySettings />}
        {activeTab === 'password' && <PasswordSettings />}
      </div>
    </div>
  );
};

export default Settings;
