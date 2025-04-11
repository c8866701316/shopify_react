// import React, { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import Button from 'react-bootstrap/Button';
// import Offcanvas from 'react-bootstrap/Offcanvas';

// const Sidebar = () => {
//   const [show, setShow] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   const isActive = (path) => {
//     return location.pathname.startsWith(path); // Check if the current path starts with the given path
//   };

//   const handleLogout = () => {
//     localStorage.clear()
//     navigate('/login'); // Redirect to the login page
//   };

//   return (
//     <>
//       <div className='p-2'>
//         <Button variant="primary" onClick={handleShow}>
//           Open Menu
//         </Button>
//       </div>
//       <Offcanvas show={show} onHide={handleClose}>
//         <Offcanvas.Header closeButton>
//           <Offcanvas.Title>Menu</Offcanvas.Title>
//         </Offcanvas.Header>
//         <Offcanvas.Body>
//           <ul className="sidebar-nav">
//             <li className="sidebar-item">
//               <Link
//                 to="/dashboard/page1"
//                 className={`sidebar-link ${isActive('/dashboard/page1') ? 'active' : ''}`}
//                 onClick={handleClose}
//               >
//                 Page 1
//               </Link>
//             </li>
//             <li className="sidebar-item">
//               <Link
//                 to="/dashboard/page2"
//                 className={`sidebar-link ${isActive('/dashboard/page2') ? 'active' : ''}`}
//                 onClick={handleClose}
//               >
//                 Page 2
//               </Link>
//             </li>
//           </ul>
//           <div className="sidebar-logout">
//             <button className="sidebar-logout-button" onClick={handleLogout}>
//               Logout
//             </button>
//           </div>
//         </Offcanvas.Body>
//       </Offcanvas>
//     </>
//   );
// };

// export default Sidebar;

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { confirmAlert } from 'react-confirm-alert'; // For logout confirmation
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS for confirmation dialog
import { TiThMenu } from 'react-icons/ti';
import { toast } from 'react-toastify';

const Sidebar = ({setToken}) => {
  const [show, setShow] = useState(false);
  const [clientType, setClientType] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch client type from localStorage
    const storedClientType = localStorage.getItem('client_type');
    console.log('Client Type:', storedClientType); // Debugging
    if (storedClientType) {
      setClientType(storedClientType);
    }
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    navigate('/login');
    toast.success('You have been successfully logged out.')
    setToken('');
    localStorage.clear()
  };

  // Menu configuration based on client type
  const menuItems = [
    {
      path: '/dashboard/client',
      label: 'Client Page',
      visible: clientType === 'admin', // Only visible for admin
    },
    {
      path: '/dashboard/promt',
      label: 'Prompt Page',
      visible: clientType === 'admin', // Only visible for admin
    },
    {
      path: '/dashboard/keyconfiguration',
      label: 'Key Configuration Page',
      visible: clientType === 'admin', // Only visible for admin
    },
    {
      path: '/dashboard/tracking',
      label: 'Tracking',
      visible: clientType === 'admin', // Only visible for admin
    },
    {
      path: '/dashboard/Stores',
      label: 'Stores',
      visible: clientType === 'client', // Only visible for client
    },
    {
      path: '/dashboard/page2',
      label: 'Page 2',
      visible: clientType === 'client', // Only visible for client
    },
  ];

  return (
    <>
      <div className='p-2'>
        <Button variant="primary" onClick={handleShow} >
        <TiThMenu />
        </Button>
      </div>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="sidebar-nav">
            {menuItems.map(
              (item, index) =>
                item.visible && (
                  <li className="sidebar-item" key={index}>
                    <Link
                      to={item.path}
                      className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                      onClick={handleClose}
                      aria-current={isActive(item.path) ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
            )}
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