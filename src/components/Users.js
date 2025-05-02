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
import { Table, Spinner, Modal, Button, Dropdown } from 'react-bootstrap';
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
import { toast } from 'react-toastify';
import { IoSearchSharp } from 'react-icons/io5';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Users = ({ role }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('');
  const [storeData, setStoreData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const token = localStorage.getItem('access_token');


  useEffect(() => {
    if (role === 'client') window.history.back();
  }, [role]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching users:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  useEffect(() => {
    // Filter users based on the selected store (filter)
    if (filter === '') {
      setFilteredUsers(users); // Show all users when filter is "Default"
    } else {
      const filtered = users.filter((user) => user.store_name === filter);
      setFilteredUsers(filtered);
    }
  }, [filter, users]);
  const handleRowClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const fetchStoreData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/stores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data?.stores) {
        setStoreData(response.data.stores);
      } else {
        toast.error('Invalid data format received.');
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      toast.error('Failed to fetch data.');
    }
  };
  const filteredStoresForPrompt = storeData.filter(
    (store) =>
      store.name.toLowerCase().includes(filter.toLowerCase()) ||
      store.client_name.toLowerCase().includes(filter.toLowerCase())
  );
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fromDate') {
      setFromDate(value);
    } else {
      setToDate(value);
    }
  };

  // Function to extract month from created_at
  const getMonthFromDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short' }); // e.g., "May"
  };

  // Group total_tokens by month using the fetched data
  const groupedData = users.reduce((acc, entry) => {
    const month = getMonthFromDate(entry.created_at);
    if (!acc[month]) {
      acc[month] = { total_tokens: 0 };
    }
    acc[month].total_tokens += entry.total_tokens;
    return acc;
  }, {});

  // Convert grouped data into arrays for the chart
  const months = Object.keys(groupedData); // e.g., ["May"]

  const chartData = selectedUser && {
    labels: months,
    datasets: [
      {
        label: 'Token Usage',
        data: [
          selectedUser.total_tokens,
        ],
        backgroundColor: ['#007bff', '#28a745', '#ffc107'],
      },
    ],
  };
  useEffect(() => {
    fetchStoreData()
  }, [])

  return (
    <div className="w-100 d-flex flex-column align-items-center p-3">
      <div className='w-100 d-flex justify-content-between align-items-center'>
        <h1>Users</h1>
        <div className='d-flex justify-content-end align-items-center' style={{ gap: '5px' }}>
          <div>
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="filter-dropdown">
                {filter === '' ? 'Default' : filter}
              </Dropdown.Toggle>
              <Dropdown.Menu
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  width: "280px",
                  padding: "8px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="d-flex flex-column gap-2 position-relative">
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search store or client..."
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      style={{
                        marginBottom: "10px",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                        paddingInlineStart: "12%"
                      }}
                    />
                  </div>
                  <div className='position-absolute' style={{ top: "15%", left: "3%" }}><IoSearchSharp /></div>
                </div>

                <Dropdown.Item onClick={() => setFilter('')}
                  className="border-bottom fw-bold lh-sm"
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                    transition: "background 0.2s",
                  }}>
                  Default
                </Dropdown.Item>
                {filteredStoresForPrompt.length > 0 ? (
                  filteredStoresForPrompt.map((store) => (
                    <Dropdown.Item
                      key={store.id}
                      onClick={() => setFilter(store.name)}
                      className="border-bottom fw-bold lh-sm"
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                        transition: "background 0.2s",
                      }}
                    >
                      <span style={{ fontWeight: "600" }}>{store.name}</span>
                      <p className="mb-1 fs-6 fw-normal text-muted">{store.client_name}</p>
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item disabled style={{ textAlign: "center", color: "#999" }}>
                    No stores available
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div>
            <label htmlFor="fromDate" className="form-label small text-muted mb-1">
            </label>
            <input
              id="fromDate"
              name="fromDate"
              type="datetime-local"
              className="form-control-sm"
              value={fromDate}
              onChange={handleDateChange}
            />
          </div>
        </div>
      </div>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Store</th>
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
          {filteredUsers.length > 0 ? (
              filteredUsers.map((user, idx) => (
                <tr key={idx} onClick={() => handleRowClick(user)} style={{ cursor: 'pointer' }}>
                  <td>{user.store_name}</td>
                  <td>{user.openai_chat_id}</td>
                  <td>{user.model}</td>
                  <td>{user.prompt_tokens}</td>
                  <td>{user.completion_tokens}</td>
                  <td>{user.total_tokens}</td>
                  <td>{user.message}</td>
                  <td>{new Date(user.created_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', color: '#999' }}>
                  No data found for this store
                </td>
              </tr>
            )}
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
            <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: 'Total Tokens' },
                },
                x: {
                  title: { display: true, text: 'Month' },
                },
              },
            }}
          />
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
