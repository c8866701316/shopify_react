// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './components/loginsetup';
// import Dashboard from './components/Dashboard';
// import Page1 from './components/Page1';
// import Page2 from './components/Page2';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={<Dashboard />}>
//           <Route index element={<Navigate to="page1" />} /> {/* Redirect to Page1 by default */}
//           <Route path="page1" element={<Page1 />} />
//           <Route path="page2" element={<Page2 />} />
//         </Route>
//         <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect invalid paths to login */}
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/loginsetup';
import Dashboard from './components/Dashboard';
import Page1 from './components/Page1';
import Page2 from './components/Page2';
import ClientPage from './components/ClientPage';
import Promptpage from './components/Promptpage';
// import Econfiguration from './components/e-configuration';
import Sidebar from './components/Sidebar';
import Keyconfiguration from './components/keyconfiguration';
import Tracking from './components/Tracking';
import Users from './components/Users';
import Chatbot from './components/Chatbot';


const App = () => {

  const [token, setToken] = React.useState(localStorage.getItem('access_token'));
  const [role, setRole] = React.useState(localStorage.getItem('client_type'));

  return (

    <div className='d-flex flex-column'>
      {/* <Router>
        {token && <Sidebar setToken={setToken} />}
        {token ? (
          <>
            <Routes>
              <Route path="/dashboard/client" element={<ClientPage role={role} />} />
              <Route path="/dashboard/stores" element={<Page1 role={role} />} />
              <Route path="/dashboard/page2" element={<Page2 role={role} />} />
              <Route path="/dashboard/prompts" element={<Promptpage role={role} />} />
              <Route path="/dashboard/keyconfiguration" element={<Keyconfiguration role={role} />} />
              <Route path="/dashboard/tracking" element={<Tracking role={role} />} />
              <Route path="/dashboard/users" element={<Users role={role} />} />
            </Routes>
            <Chatbot position="bottom-right" height={500} width={400} />
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login setRole={setRole} setToken={setToken} role={role} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </Router> */}
      <Router>
        {token && <Sidebar setToken={setToken} />}
        <Routes>
          <Route
            path="/"
            element={
              token ? (
                role === "client" ? (
                  <Navigate to="/dashboard/stores" />
                ) : (
                  <Navigate to="/dashboard/client" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {token && (
            <>
              <Route path="/dashboard/client" element={<ClientPage role={role} />} />
              <Route path="/dashboard/stores" element={<Page1 role={role} />} />
              <Route path="/dashboard/page2" element={<Page2 role={role} />} />
              <Route path="/dashboard/prompts" element={<Promptpage role={role} />} />
              <Route path="/dashboard/keyconfiguration" element={<Keyconfiguration role={role} />} />
              <Route path="/dashboard/tracking" element={<Tracking role={role} />} />
              <Route path="/dashboard/users" element={<Users role={role} />} />
            </>
          )}
           {!token && (<Route path="/login" element={<Login setRole={setRole} setToken={setToken} role={role} />} />)}
          <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
        </Routes>
        {token && <Chatbot position="bottom-right" height={500} width={400} />}
      </Router>

    </div>
  );
};

export default App;