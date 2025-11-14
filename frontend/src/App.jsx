import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FileUpload from './components/FileUpload';
import FileGallery from './components/FileGallery';
import Stats from './components/Stats';
import './styles/App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger refresh of gallery and stats
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="app">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="container">
        <header className="header">
          <h1>File Upload Manager</h1>
          <p>Upload and manage your files with Cloudinary</p>
        </header>

        <Stats refreshTrigger={refreshTrigger} />

        <FileUpload onUploadSuccess={handleUploadSuccess} />

        <FileGallery refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}

export default App;
