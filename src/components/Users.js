// import React, { useEffect, useState } from 'react';
// import { Table, Spinner } from 'react-bootstrap';
// import axios from 'axios';

// const Users = ({ role }) => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
  // const token = localStorage.getItem('access_token');

//   // Redirect if role is client
//   useEffect(() => {
//     if (role === 'client') {
//       window.history.back();
//     }
//   }, [role]);

//   // Fetch users from backend
//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
        // const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/users`,{
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
//         setUsers(response.data.data);
//       } catch (error) {
//         console.error('Error fetching users:', error.response?.data || error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   return (
//     <div className='"d-flex flex-column align-items-center p-3'>
//       <h1>Users</h1>
//       {loading ? (
//         <Spinner animation="border" />
//       ) : (
//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>OpenAI Chat ID</th>
//               <th>Model</th>
//               <th>Prompt Tokens</th>
//               <th>Completion Tokens</th>
//               <th>Total Tokens</th>
//               <th>Message</th>
//               <th>Created At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user, idx) => (
//               <tr key={idx}>
//                 <td>{user.openai_chat_id}</td>
//                 <td>{user.model}</td>
//                 <td>{user.prompt_tokens}</td>
//                 <td>{user.completion_tokens}</td>
//                 <td>{user.total_tokens}</td>
//                 <td>{user.message}</td>
//                 <td>{new Date(user.created_at).toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </div>
//   );
// };

// export default Users;
import React, { useEffect, useState } from 'react';
import { Table, Spinner, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Users = ({ role }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('access_token');


  useEffect(() => {
    if (role === 'client') window.history.back();
  }, [role]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/users`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching users:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const chartData = selectedUser && {
    labels: ['Prompt Tokens', 'Completion Tokens', 'Total Tokens'],
    datasets: [
      {
        label: 'Token Usage',
        data: [
          selectedUser.prompt_tokens,
          selectedUser.completion_tokens,
          selectedUser.total_tokens,
        ],
        backgroundColor: ['#007bff', '#28a745', '#ffc107'],
      },
    ],
  };

  return (
    <div className="d-flex flex-column align-items-center p-3">
      <h1>Users</h1>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>OpenAI Chat ID</th>
              <th>Model</th>
              <th>Prompt Tokens</th>
              <th>Completion Tokens</th>
              <th>Total Tokens</th>
              <th>Message</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx} onClick={() => handleRowClick(user)} style={{ cursor: 'pointer' }}>
                <td>{user.openai_chat_id}</td>
                <td>{user.model}</td>
                <td>{user.prompt_tokens}</td>
                <td>{user.completion_tokens}</td>
                <td>{user.total_tokens}</td>
                <td>{user.message}</td>
                <td>{new Date(user.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal with Chart */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Token Usage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          ) : (
            'No data selected'
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
