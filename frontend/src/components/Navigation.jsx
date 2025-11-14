import { Link, useNavigate } from 'react-router-dom';
import {
  FiUploadCloud,
  FiUser,
  FiSettings,
  FiUsers,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiHome
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <FiUploadCloud />
          <span>File Upload Manager</span>
        </Link>

        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/" className="nav-link">
                <FiHome /> Home
              </Link>

              {(user?.role === 'admin' || user?.role === 'moderator') && (
                <Link to="/users" className="nav-link">
                  <FiUsers /> Users
                </Link>
              )}

              <Link to="/settings" className="nav-link">
                <FiSettings /> Settings
              </Link>

              <div className="nav-user">
                <FiUser />
                <span className="user-info">
                  <span className="username">{user?.username}</span>
                  <span className="user-role">{user?.role}</span>
                </span>
              </div>

              <button onClick={handleLogout} className="nav-link nav-logout">
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <FiLogIn /> Login
              </Link>
              <Link to="/register" className="nav-link nav-register">
                <FiUserPlus /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
