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
import Econfiguration from './components/e-configuration';
import Sidebar from './components/Sidebar';

const App = () => {

  const [token, setToken] = React.useState(localStorage.getItem('access_token'));
  const [role, setRole] = React.useState(localStorage.getItem('client_type'));

  return (

    <div className='d-flex flex-column'>
      <Router>
        {token && <Sidebar setToken={setToken} />}
        {
          token ?
            <Routes>
              <>
                {/* <Route path="/login" element={<Login setRole={setRole} setToken={setToken} role={role} />} /> */}
                <Route path="/dashboard/client" element={<ClientPage role={role} />} />
                {/* <Route index element={<Navigate to="page1" role={role} />} /> Redirect to Page1 by default */}
                <Route path="/dashboard/page1" element={<Page1 role={role} />} />
                <Route path="/dashboard/page2" element={<Page2 role={role} />} />
                <Route path="/dashboard/promt" element={<Promptpage role={role} />} />
                <Route path="/dashboard/econfiguration" element={<Econfiguration role={role} />} />
                {/* <Route path="*" element={<Navigate to="/login" />} /> */}
              </>
            </Routes> :
                <Login setRole={setRole} setToken={setToken} role={role} />
            //  <Navigate to={"/login"} />
        }
      </Router>
    </div>
  );
};

export default App;