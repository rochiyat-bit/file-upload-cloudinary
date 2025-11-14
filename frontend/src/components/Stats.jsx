import { useState, useEffect } from 'react';
import { FiFile, FiHardDrive, FiImage } from 'react-icons/fi';
import { getUploadStats } from '../services/uploadService';

const Stats = ({ refreshTrigger }) => {
  const [stats, setStats] = useState({
    totalUploads: 0,
    totalSizeMB: 0,
    uploadsByType: [],
  });

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const fetchStats = async () => {
    try {
      const response = await getUploadStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Stats error:', error);
    }
  };

  return (
    <div className="stats-container">
      <div className="stat-card">
        <FiFile style={{ fontSize: '2rem', color: '#667eea' }} />
        <h3>{stats.totalUploads}</h3>
        <p>Total Files</p>
      </div>

      <div className="stat-card">
        <FiHardDrive style={{ fontSize: '2rem', color: '#764ba2' }} />
        <h3>{stats.totalSizeMB} MB</h3>
        <p>Storage Used</p>
      </div>

      {stats.uploadsByType && stats.uploadsByType.length > 0 && (
        <>
          {stats.uploadsByType.map((type) => (
            <div key={type.resourceType} className="stat-card">
              <FiImage style={{ fontSize: '2rem', color: '#667eea' }} />
              <h3>{type.count}</h3>
              <p>{type.resourceType}s</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Stats;
