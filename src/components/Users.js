// // import React, { useEffect, useState } from 'react';
// // import { Table, Spinner } from 'react-bootstrap';
// // import axios from 'axios';

// // const Users = ({ role }) => {
// //   const [users, setUsers] = useState([]);
// //   const [loading, setLoading] = useState(false);
// // const token = localStorage.getItem('access_token');

// //   // Redirect if role is client
// //   useEffect(() => {
// //     if (role === 'client') {
// //       window.history.back();
// //     }
// //   }, [role]);

// //   // Fetch users from backend
// //   useEffect(() => {
// //     const fetchUsers = async () => {
// //       setLoading(true);
// //       try {
// // const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/users`,{
// //   headers: {
// //     Authorization: `Bearer ${token}`,
// //   },
// // });
// //         setUsers(response.data.data);
// //       } catch (error) {
// //         console.error('Error fetching users:', error.response?.data || error.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchUsers();
// //   }, []);

// //   return (
// //     <div className='"d-flex flex-column align-items-center p-3'>
// //       <h1>Users</h1>
// //       {loading ? (
// //         <Spinner animation="border" />
// //       ) : (
// //         <Table striped bordered hover>
// //           <thead>
// //             <tr>
// //               <th>OpenAI Chat ID</th>
// //               <th>Model</th>
// //               <th>Prompt Tokens</th>
// //               <th>Completion Tokens</th>
// //               <th>Total Tokens</th>
// //               <th>Message</th>
// //               <th>Created At</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {users.map((user, idx) => (
// //               <tr key={idx}>
// //                 <td>{user.openai_chat_id}</td>
// //                 <td>{user.model}</td>
// //                 <td>{user.prompt_tokens}</td>
// //                 <td>{user.completion_tokens}</td>
// //                 <td>{user.total_tokens}</td>
// //                 <td>{user.message}</td>
// //                 <td>{new Date(user.created_at).toLocaleString()}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </Table>
// //       )}
// //     </div>
// //   );
// // };

// // export default Users;
// import React, { useEffect, useState } from 'react';
// import { Table, Spinner, Modal, Button, Dropdown } from 'react-bootstrap';
// import axios from 'axios';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { toast } from 'react-toastify';
// import { IoSearchSharp } from 'react-icons/io5';

// // Register chart components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const Users = ({ role }) => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [filter, setFilter] = useState('');
//   const [storeData, setStoreData] = useState([]);
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const token = localStorage.getItem('access_token');


//   useEffect(() => {
//     if (role === 'client') window.history.back();
//   }, [role]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/users`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUsers(response.data.data);
//         setFilteredUsers(response.data.data);
//       } catch (error) {
//         console.error('Error fetching users:', error.response?.data || error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);
//   useEffect(() => {
//     // Filter users based on the selected store (filter)
//     if (filter === '') {
//       setFilteredUsers(users); // Show all users when filter is "Default"
//     } else {
//       const filtered = users.filter((user) => user.store_name === filter);
//       setFilteredUsers(filtered);
//     }
//   }, [filter, users]);
//   const handleRowClick = (user) => {
//     setSelectedUser(user);
//     setShowModal(true);
//   };

//   const fetchStoreData = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/stores`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.data?.stores) {
//         setStoreData(response.data.stores);
//       } else {
//         toast.error('Invalid data format received.');
//       }
//     } catch (error) {
//       console.error('Error fetching dropdown data:', error);
//       toast.error('Failed to fetch data.');
//     }
//   };
//   const filteredStoresForPrompt = storeData.filter(
//     (store) =>
//       store.name.toLowerCase().includes(filter.toLowerCase()) ||
//       store.client_name.toLowerCase().includes(filter.toLowerCase())
//   );
//   const handleDateChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'fromDate') {
//       setFromDate(value);
//     } else {
//       setToDate(value);
//     }
//   };

//   // Function to extract month from created_at
//   const getMonthFromDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString('default', { month: 'short' }); // e.g., "May"
//   };

//   // Group total_tokens by month using the fetched data
//   const groupedData = users.reduce((acc, entry) => {
//     const month = getMonthFromDate(entry.created_at);
//     if (!acc[month]) {
//       acc[month] = { total_tokens: 0 };
//     }
//     acc[month].total_tokens += entry.total_tokens;
//     return acc;
//   }, {});

//   // Convert grouped data into arrays for the chart
//   const months = Object.keys(groupedData); // e.g., ["May"]

//   const chartData = selectedUser && {
//     labels: months,
//     datasets: [
//       {
//         label: 'Token Usage',
//         data: [
//           selectedUser.total_tokens,
//         ],
//         backgroundColor: ['#007bff', '#28a745', '#ffc107'],
//       },
//     ],
//   };
//   useEffect(() => {
//     fetchStoreData()
//   }, [])

//   return (
//     <div className="w-100 d-flex flex-column align-items-center p-3">
//       <div className='w-100 d-flex justify-content-between align-items-center'>
//         <h1>Users</h1>
//         <div className='d-flex justify-content-end align-items-center' style={{ gap: '5px' }}>
//           <div>
//             <Dropdown>
//               <Dropdown.Toggle variant="outline-secondary" id="filter-dropdown">
//                 {filter === '' ? 'Default' : filter}
//               </Dropdown.Toggle>
//               <Dropdown.Menu
//                 style={{
//                   maxHeight: "300px",
//                   overflowY: "auto",
//                   width: "280px",
//                   padding: "8px",
//                   borderRadius: "8px",
//                   boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//                 }}
//               >
//                 <div className="d-flex flex-column gap-2 position-relative">
//                   <div>
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Search store or client..."
//                       value={filter}
//                       onChange={(e) => setFilter(e.target.value)}
//                       style={{
//                         marginBottom: "10px",
//                         padding: "8px",
//                         borderRadius: "6px",
//                         border: "1px solid #ccc",
//                         fontSize: "14px",
//                         paddingInlineStart: "12%"
//                       }}
//                     />
//                   </div>
//                   <div className='position-absolute' style={{ top: "15%", left: "3%" }}><IoSearchSharp /></div>
//                 </div>

//                 <Dropdown.Item onClick={() => setFilter('')}
//                   className="border-bottom fw-bold lh-sm"
//                   style={{
//                     padding: "10px",
//                     borderBottom: "1px solid #ddd",
//                     transition: "background 0.2s",
//                   }}>
//                   Default
//                 </Dropdown.Item>
//                 {filteredStoresForPrompt.length > 0 ? (
//                   filteredStoresForPrompt.map((store) => (
//                     <Dropdown.Item
//                       key={store.id}
//                       onClick={() => setFilter(store.name)}
//                       className="border-bottom fw-bold lh-sm"
//                       style={{
//                         padding: "10px",
//                         borderBottom: "1px solid #ddd",
//                         transition: "background 0.2s",
//                       }}
//                     >
//                       <span style={{ fontWeight: "600" }}>{store.name}</span>
//                       <p className="mb-1 fs-6 fw-normal text-muted">{store.client_name}</p>
//                     </Dropdown.Item>
//                   ))
//                 ) : (
//                   <Dropdown.Item disabled style={{ textAlign: "center", color: "#999" }}>
//                     No stores available
//                   </Dropdown.Item>
//                 )}
//               </Dropdown.Menu>
//             </Dropdown>
//           </div>
//           <div>
//             <label htmlFor="fromDate" className="form-label small text-muted mb-1">
//             </label>
//             <input
//               id="fromDate"
//               name="fromDate"
//               type="datetime-local"
//               className="form-control-sm"
//               value={fromDate}
//               onChange={handleDateChange}
//             />
//           </div>
//         </div>
//       </div>
//       {loading ? (
//         <Spinner animation="border" />
//       ) : (
//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>Store</th>
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
//           {filteredUsers.length > 0 ? (
//               filteredUsers.map((user, idx) => (
//                 <tr key={idx} onClick={() => handleRowClick(user)} style={{ cursor: 'pointer' }}>
//                   <td>{user.store_name}</td>
//                   <td>{user.openai_chat_id}</td>
//                   <td>{user.model}</td>
//                   <td>{user.prompt_tokens}</td>
//                   <td>{user.completion_tokens}</td>
//                   <td>{user.total_tokens}</td>
//                   <td>{user.message}</td>
//                   <td>{new Date(user.created_at).toLocaleString()}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" style={{ textAlign: 'center', color: '#999' }}>
//                   No data found for this store
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       )}

//       {/* Modal with Chart */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Token Usage</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedUser ? (
//             <Bar
//             data={chartData}
//             options={{
//               responsive: true,
//               plugins: {
//                 legend: { display: true },
//               },
//               scales: {
//                 y: {
//                   beginAtZero: true,
//                   title: { display: true, text: 'Total Tokens' },
//                 },
//                 x: {
//                   title: { display: true, text: 'Month' },
//                 },
//               },
//             }}
//           />
//           ) : (
//             'No data selected'
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default Users;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Dropdown } from 'react-bootstrap';
// import { IoSearchSharp } from 'react-icons/io5';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [storeData, setStoreData] = useState([]);
//   const [filter, setFilter] = useState('');
//   const token = localStorage.getItem('access_token');

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/users`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUsers(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     const fetchStores = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/stores`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setStoreData(response.data.stores || []);
//       } catch (error) {
//         console.error('Error fetching stores:', error);
//       }
//     };

//     fetchUsers();
//     fetchStores();
//   }, []);

//   const getMonthFromDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString('default', { month: 'short' });
//   };

//   const groupDataByStore = () => {
//     const grouped = {};
//     users.forEach((entry) => {
//       const store = entry.store_name;
//       const month = getMonthFromDate(entry.created_at);
//       if (!grouped[store]) grouped[store] = {};
//       if (!grouped[store][month]) grouped[store][month] = 0;
//       grouped[store][month] += entry.total_tokens;
//     });
//     return grouped;
//   };

//   const generateChartData = (data) => {
//     return Object.entries(data).map(([store, monthData]) => {
//       const labels = Object.keys(monthData);
//       const values = Object.values(monthData);
//       return {
//         store,
//         data: {
//           labels,
//           datasets: [
//             {
//               label: 'Total Tokens',
//               data: values,
//               backgroundColor: '#007bff',
//             },
//           ],
//         },
//       };
//     });
//   };

//   const charts = generateChartData(groupDataByStore());
//   const filteredCharts = filter ? charts.filter((c) => c.store === filter) : charts;

//   const filteredStoresForPrompt = storeData.filter(
//     (store) =>
//       store.name.toLowerCase().includes(filter.toLowerCase()) ||
//       store.client_name.toLowerCase().includes(filter.toLowerCase())
//   );

//   return (
//     <div className="w-100 d-flex flex-column align-items-center p-3">
//       <div className="w-100 d-flex justify-content-between align-items-center mb-4">
//         <h2 className="mb-0">Store-wise Token Usage</h2>
//         <div className="d-flex align-items-center gap-2">
//           <Dropdown>
//             <Dropdown.Toggle variant="outline-secondary" id="filter-dropdown">
//               {filter === '' ? 'All Stores' : filter}
//             </Dropdown.Toggle>
//             <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto', width: '280px', padding: '8px' }}>
//               <div className="d-flex flex-column gap-2 position-relative">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Search store or client..."
//                   value={filter}
//                   onChange={(e) => setFilter(e.target.value)}
//                   style={{ marginBottom: '10px', padding: '8px', borderRadius: '6px', paddingInlineStart: '12%' }}
//                 />
//                 <div className="position-absolute" style={{ top: '15%', left: '3%' }}>
//                   <IoSearchSharp />
//                 </div>
//               </div>
//               <Dropdown.Item onClick={() => setFilter('')} className="fw-bold">All Stores</Dropdown.Item>
//               {filteredStoresForPrompt.length > 0 ? (
//                 filteredStoresForPrompt.map((store) => (
//                   <Dropdown.Item key={store.id} onClick={() => setFilter(store.name)} className="fw-bold">
//                     <span>{store.name}</span>
//                     <p className="mb-1 fs-6 fw-normal text-muted">{store.client_name}</p>
//                   </Dropdown.Item>
//                 ))
//               ) : (
//                 <Dropdown.Item disabled>No stores found</Dropdown.Item>
//               )}
//             </Dropdown.Menu>
//           </Dropdown>
//         </div>
//       </div>

//       <div className="w-100">
//         {filteredCharts.length === 0 ? (
//           <p className="text-muted text-center">No chart data available.</p>
//         ) : (
//           filteredCharts.map((chart, idx) => (
//             <div key={idx} className="mb-5 w-100" style={{ maxWidth: '100%' }}>
//               <h5 className="text-primary mb-3">{chart.store}</h5>
//               <Bar
//                 data={chart.data}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: {
//                     legend: { display: true },
//                     title: { display: false },
//                   },
//                   scales: {
//                     y: {
//                       beginAtZero: true,
//                       title: { display: true, text: 'Total Tokens' },
//                     },
//                     x: {
//                       title: { display: true, text: 'Month' },
//                     },
//                   },
//                 }}
//                 height={300}
//               />
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Users;
import React, { useEffect, useState } from 'react';
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
import { Dropdown, Spinner, Container, Row, Col, Form } from 'react-bootstrap';
import { IoSearchSharp } from 'react-icons/io5';
import { FaFilter, FaStore } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Users = () => {
  const [users, setUsers] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [usersResponse, storesResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/admin/stores`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        
        setUsers(usersResponse.data.data || []);
        setStoreData(storesResponse.data.stores || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const getMonthFromDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short' });
  };

  const groupDataByStore = () => {
    const grouped = {};
    users.forEach((entry) => {
      const store = entry.store_name;
      const month = getMonthFromDate(entry.created_at);
      if (!grouped[store]) grouped[store] = {};
      if (!grouped[store][month]) grouped[store][month] = 0;
      grouped[store][month] += entry.total_tokens;
    });
    return grouped;
  };

  const generateChartData = (data) => {
    return Object.entries(data).map(([store, monthData]) => {
      const labels = Object.keys(monthData);
      const values = Object.values(monthData);
      return {
        store,
        data: {
          labels,
          datasets: [
            {
              label: 'Total Tokens',
              data: values,
              backgroundColor: '#4e73df',
              borderColor: '#2e59d9',
              borderWidth: 1,
              borderRadius: 4,
              hoverBackgroundColor: '#2e59d9',
            },
          ],
        },
      };
    });
  };

  const charts = generateChartData(groupDataByStore());
  const filteredCharts = filter ? charts.filter((c) => c.store === filter) : charts;

  const filteredStoresForPrompt = storeData.filter(
    (store) =>
      store.name.toLowerCase().includes(filter.toLowerCase()) ||
      store.client_name.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div className="mb-3 mb-md-0">
              <h2 className="h4 mb-1">Store-wise Token Usage</h2>
              <p className="text-muted mb-0">
                Visualize token consumption across different stores
              </p>
            </div>
            
            <div className="d-flex align-items-center">
              <Dropdown className="ms-2">
                <Dropdown.Toggle variant="outline-primary" id="filter-dropdown" className="d-flex align-items-center">
                  <FaFilter className="me-2" />
                  {filter === '' ? 'All Stores' : filter}
                </Dropdown.Toggle>
                <Dropdown.Menu className="p-3" style={{ maxHeight: '400px', overflowY: 'auto', width: '300px' }}>
                  <div className="position-relative mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Search store or client..."
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="ps-4"
                    />
                    <IoSearchSharp className="position-absolute top-50 start-0 translate-middle-y ms-3" />
                  </div>
                  
                  <Dropdown.Item 
                    onClick={() => setFilter('')} 
                    className="fw-bold d-flex align-items-center"
                    active={filter === ''}
                  >
                    <FaStore className="me-2" />
                    All Stores
                  </Dropdown.Item>
                  
                  <Dropdown.Divider />
                  
                  {filteredStoresForPrompt.length > 0 ? (
                    filteredStoresForPrompt.map((store) => (
                      <Dropdown.Item 
                        key={store.id} 
                        onClick={() => setFilter(store.name)} 
                        className="fw-bold"
                        active={filter === store.name}
                      >
                        <div>
                          <div>{store.name}</div>
                          <small className="text-muted fw-normal">{store.client_name}</small>
                        </div>
                      </Dropdown.Item>
                    ))
                  ) : (
                    <Dropdown.Item disabled className="text-center text-muted py-2">
                      No matching stores found
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          {filteredCharts.length === 0 ? (
            <div className="text-center py-5 bg-light rounded">
              <FaStore size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No chart data available</h5>
              <p className="text-muted">Try selecting a different store or check back later</p>
            </div>
          ) : (
            <Row className="g-4">
              {filteredCharts.map((chart, idx) => (
                <Col key={idx} xs={12} lg={filteredCharts.length > 1 ? 6 : 12}>
                  <div className="card shadow-sm h-100">
                    <div className="card-header bg-white border-bottom-0">
                      <h5 className="mb-0 text-primary">
                        <FaStore className="me-2" />
                        {chart.store}
                      </h5>
                    </div>
                    <div className="card-body p-3">
                      <div style={{ height: '300px' }}>
                        <Bar
                          data={chart.data}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { 
                                display: true,
                                position: 'top',
                                labels: {
                                  boxWidth: 12,
                                  padding: 20,
                                  usePointStyle: true,
                                }
                              },
                              tooltip: {
                                backgroundColor: '#2e59d9',
                                titleFont: { size: 14 },
                                bodyFont: { size: 12 },
                                padding: 10,
                                displayColors: false,
                              }
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                title: { 
                                  display: true, 
                                  text: 'Total Tokens',
                                  font: {
                                    weight: 'bold'
                                  }
                                },
                                grid: {
                                  drawBorder: false
                                }
                              },
                              x: {
                                title: { 
                                  display: true, 
                                  text: 'Month',
                                  font: {
                                    weight: 'bold'
                                  }
                                },
                                grid: {
                                  display: false
                                }
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Users;