import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import FileGallery from '../components/FileGallery';
import Stats from '../components/Stats';

const Home = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>File Upload Manager</h1>
        <p>Upload and manage your files with Cloudinary</p>
      </header>

      <Stats refreshTrigger={refreshTrigger} />

      <FileUpload onUploadSuccess={handleUploadSuccess} />

      <FileGallery refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default Home;
