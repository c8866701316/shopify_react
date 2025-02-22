import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isActive = (path) => {
    return location.pathname.startsWith(path); // Check if the current path starts with the given path
  };

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login'); // Redirect to the login page
  };

  return (
    <>
      <div className='p-2'>
        <Button variant="primary" onClick={handleShow}>
          Open Menu
        </Button>
      </div>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="sidebar-nav">
            <li className="sidebar-item">
              <Link
                to="/dashboard/page1"
                className={`sidebar-link ${isActive('/dashboard/page1') ? 'active' : ''}`}
                onClick={handleClose}
              >
                Page 1
              </Link>
            </li>
            <li className="sidebar-item">
              <Link
                to="/dashboard/page2"
                className={`sidebar-link ${isActive('/dashboard/page2') ? 'active' : ''}`}
                onClick={handleClose}
              >
                Page 2
              </Link>
            </li>
          </ul>
          <div className="sidebar-logout">
            <button className="sidebar-logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;