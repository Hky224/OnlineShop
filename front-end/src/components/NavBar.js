import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <span className="navbar-brand">Imagineering</span>
          <button className="btn btn-link nav-link" onClick={handleHome}>Home</button>
        </div>

        <div className="d-flex align-items-center">
          {userEmail ? (
            <div className="d-flex align-items-center">
              <div className="nav-link me-2">{userEmail}</div>
              <button className="btn btn-outline-primary" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <button className="btn btn-outline-primary me-2" onClick={handleLogin}>Login</button>
              <button className="btn btn-outline-primary" onClick={handleRegister}>Register</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
