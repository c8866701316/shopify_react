import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Page1 from './Page1';
import Page2 from './Page2';

const Dashboard = () => {
  const location = useLocation();

  // Determine which page to render based on the current route
  const renderPage = () => {
    if (location.pathname === '/dashboard/Stores') {
      return <Page1 />;
    } else if (location.pathname === '/dashboard/page2') {
      return <Page2 />;
    }
    return null;
  };

  return (
    <div>
      <Sidebar />
      <div className="content">
        {renderPage()} {/* Render the appropriate page */}
      </div>
    </div>
  );
};

export default Dashboard;