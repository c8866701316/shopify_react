import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/loginsetup';
import Dashboard from './components/Dashboard';
import Page1 from './components/Page1';
import Page2 from './components/Page2';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="page1" />} /> {/* Redirect to Page1 by default */}
          <Route path="page1" element={<Page1 />} />
          <Route path="page2" element={<Page2 />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect invalid paths to login */}
      </Routes>
    </Router>
  );
};

export default App;