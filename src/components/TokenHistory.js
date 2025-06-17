// // import axios from 'axios';
// // import React, { useEffect, useState } from 'react';
// // import { Bar } from 'react-chartjs-2';
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// // } from 'chart.js';
// // import { Spinner, Form, Card, Button } from 'react-bootstrap';
// // import { FaStore } from 'react-icons/fa';
// // import Select from 'react-select';
// // import makeAnimated from 'react-select/animated';
// // import ReactPaginate from 'react-paginate';
// // import { toast, ToastContainer } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';

// // ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
// // const animatedComponents = makeAnimated();

// // const TokenHistory = () => {
// //   const [users, setUsers] = useState([]);
// //   const [storeData, setStoreData] = useState([]);
// //   const [structureClients, setStructureClients] = useState([]);
// //   const [selectedStores, setSelectedStores] = useState([]);
// //   const [selectedStructureClients, setSelectedStructureClients] = useState([]);
// //   const [startDate, setStartDate] = useState('');
// //   const [endDate, setEndDate] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const token = localStorage.getItem('access_token');
// //   const clientType = localStorage.getItem('client_type'); // 'admin' or 'client'

// //   // Chart pagination
// //   const [currentPage, setCurrentPage] = useState(0);
// //   const chartsPerPage = 6;

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);
// //         setError(null);

// //         let usersRes, storesRes, clientsRes;

// //         if (clientType === 'admin') {
// //           [usersRes, storesRes, clientsRes] = await Promise.all([
// //             axios.get(`${process.env.REACT_APP_API_URL}/get-token-history`, {
// //               headers: { Authorization: `Bearer ${token}` },
// //             }),
// //             axios.get(`${process.env.REACT_APP_API_URL}/admin/stores`, {
// //               headers: { Authorization: `Bearer ${token}` },
// //             }),
// //             axios.get(`${process.env.REACT_APP_API_URL}/admin/structureclient`, {
// //               headers: { Authorization: `Bearer ${token}` },
// //             }),
// //           ]);
// //         } else {
// //           [usersRes, storesRes] = await Promise.all([
// //             axios.get(`${process.env.REACT_APP_API_URL}/admin/get-token-history`, {
// //               headers: { Authorization: `Bearer ${token}` },
// //             }),
// //             axios.get(`${process.env.REACT_APP_API_URL}/store/names`, {
// //               headers: { Authorization: `Bearer ${token}` },
// //             }),
// //           ]);
// //           clientsRes = { data: { clients: [] } };
// //         }

// //         const usersData = usersRes.data.data || [];
// //         setUsers(usersData);
// //         setStoreData(storesRes.data.stores || storesRes.data || []);
// //         setStructureClients(clientsRes.data.clients || []);

// //         // 👇 Auto-select date range from data
// //         if (usersData.length > 0) {
// //           const dates = usersData.map(u => new Date(u.created_at));
// //           const minDate = new Date(Math.min(...dates));
// //           const maxDate = new Date(Math.max(...dates));

// //           setStartDate(minDate.toISOString().split('T')[0]);
// //           setEndDate(maxDate.toISOString().split('T')[0]);
// //         }

// //       } catch (err) {
// //         console.error('Error fetching data:', err);
// //         setError('Failed to load data. Please try again later.');
// //         toast.error('Failed to load data. Please try again later.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [token, clientType]);

// //   useEffect(() => {
// //     setCurrentPage(0);
// //   }, [selectedStores, selectedStructureClients, startDate, endDate]);

// //   const getFullDate = (dateString) => {
// //     const date = new Date(dateString);
// //     return date.toLocaleDateString('default', {
// //       month: 'short',
// //       day: 'numeric',
// //       year: 'numeric',
// //     });
// //   };

// //   const filteredUsers = users.filter((user) => {
// //     const created = new Date(user.created_at);
// //     const matchStore =
// //       selectedStores.length === 0 ||
// //       (user.store_name && selectedStores.some((store) => store.value === user.store_name)) ||
// //       (!user.store_name && selectedStores.some((store) => store.value === 'Unknown Store'));

// //     const matchStructureClient =
// //       clientType !== 'admin' ||
// //       selectedStructureClients.length === 0 ||
// //       (user.structure_client_id &&
// //         selectedStructureClients.some((sc) => sc.value === user.structure_client_id));

// //     const matchDate =
// //       (!startDate || created >= new Date(startDate)) &&
// //       (!endDate || created <= new Date(endDate));

// //     return matchStore && matchStructureClient && matchDate;
// //   });

// //   const groupDataByStore = () => {
// //     const grouped = {};

// //     filteredUsers.forEach((entry) => {
// //       const store = entry.store_name || 'Unknown Store';
// //       const date = getFullDate(entry.created_at);
// //       const tokens = entry.total_tokens || 0;

// //       if (!grouped[store]) {
// //         grouped[store] = {
// //           months: {}, // Store date-wise token data
// //           totalTokens: 0, // Initialize totalTokens
// //         };
// //       }

// //       if (!grouped[store].months[date]) {
// //         grouped[store].months[date] = 0;
// //       }

// //       grouped[store].months[date] += tokens;
// //       grouped[store].totalTokens += tokens; // Accumulate totalTokens
// //     });

// //     return grouped;
// //   };

// //   const generateChartData = (data) => {
// //     return Object.entries(data)
// //       .map(([store, storeData]) => {
// //         const sortedEntries = Object.entries(storeData.months).sort(
// //           ([a], [b]) => new Date(a) - new Date(b)
// //         );

// //         const labels = sortedEntries.map(([date]) => date);
// //         const values = sortedEntries.map(([, value]) => value);

// //         return {
// //           store,
// //           totalTokens: storeData.totalTokens, // Include totalTokens
// //           data: {
// //             labels,
// //             datasets: [
// //               {
// //                 label: 'Total Tokens',
// //                 data: values,
// //                 backgroundColor: '#4e73df',
// //                 borderColor: '#2e59d9',
// //                 borderWidth: 1,
// //                 borderRadius: 4,
// //                 hoverBackgroundColor: '#2e59d9',
// //               },
// //             ],
// //           },
// //         };
// //       })
// //       .sort((a, b) => b.totalTokens - a.totalTokens); // Sort by totalTokens (descending)
// //   };

// //   const storeOptions = [
// //     ...storeData.map((store) => ({
// //       value: store.name,
// //       label: store.client_name ? `${store.name} (${store.client_name})` : store.name,
// //     })),
// //     ...(clientType === 'admin' ? [{ value: 'Unknown Store', label: 'Unknown Store' }] : []),
// //   ];

// //   const structureClientOptions = structureClients.map((client) => ({
// //     value: client.id,
// //     label: client.email,
// //   }));

// //   const charts = generateChartData(groupDataByStore());
// //   const chartPageCount = Math.ceil(charts.length / chartsPerPage);
// //   const chartOffset = currentPage * chartsPerPage;
// //   const paginatedCharts = charts.slice(chartOffset, chartOffset + chartsPerPa  

// //   const handlePageChange = ({ selected }) => {
// //     setCurrentPage(selected);
// //   };

// //   const handleClearFilter = () => {
// //     setSelectedStores([]);
// //     setSelectedStructureClients([]);

// //     if (users.length > 0) {
// //       const dates = users.map(u => new Date(u.created_at));
// //       const minDate = new Date(Math.min(...dates));
// //       const maxDate = new Date(Math.max(...dates));

// //       setStartDate(minDate.toISOString().split('T')[0]);
// //       setEndDate(maxDate.toISOString().split('T')[0]);
// //     } else {
// //       setStartDate('');
// //       setEndDate('');
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
// //         <Spinner animation="border" variant="primary" />
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
// //         <div className="alert alert-danger">{error}</div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-4">
// //       <ToastContainer />
// //       <div className="d-sm-flex justify-content-between align-items-center mb-4">
// //         <h2 className="mb-0">Store-wise Token Usage</h2>
// //         <div className="d-flex align-items-center gap-2">
// //           <Button variant="primary" onClick={handleClearFilter}>
// //             Clear All Filters
// //           </Button>
// //         </div>
// //       </div>

// //       <Card className="mb-4 shadow-sm">
// //         <Card.Body>
// //           <div className="row g-3">
// //             {/* Date Range */}
// //             <div className="col-12 col-md-6 col-lg-4">
// //               <div className="h-100">
// //                 <div className="d-flex flex-column flex-sm-row gap-2">
// //                   <div className="w-100">
// //                     <label className="form-label fw-semibold mb-2">From</label>
// //                     <input
// //                       type="date"
// //                       className="form-control"
// //                       value={startDate}
// //                       onChange={(e) => setStartDate(e.target.value)}
// //                     />
// //                   </div>
// //                   <div className="w-100">
// //                     <label className="form-label fw-semibold mb-2">To</label>
// //                     <input
// //                       type="date"
// //                       className="form-control"
// //                       value={endDate}
// //                       onChange={(e) => setEndDate(e.target.value)}
// //                     />
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Store Filter */}
// //             <div className="col-12 col-md-6 col-lg-4">
// //               <div className="h-100">
// //                 <label className="form-label fw-semibold mb-2">Filter by Stores</label>
// //                 <Select
// //                   isMulti
// //                   options={storeOptions}
// //                   value={selectedStores}
// //                   onChange={setSelectedStores}
// //                   components={animatedComponents}
// //                   placeholder="Select stores..."
// //                   closeMenuOnSelect={false}
// //                   className="react-select-container"
// //                   classNamePrefix="react-select"
// //                 />
// //               </div>
// //             </div>

// //             {/* Structure Clients Filter (Admin only) */}
// //             {clientType === 'admin' && (
// //               <div className="col-12 col-md-6 col-lg-4">
// //                 <div className="h-100">
// //                   <label className="form-label fw-semibold mb-2">Filter by Structure Clients</label>
// //                   <Select
// //                     isMulti
// //                     options={structureClientOptions}
// //                     value={selectedStructureClients}
// //                     onChange={setSelectedStructureClients}
// //                     components={animatedComponents}
// //                     placeholder="Select structure clients..."
// //                     closeMenuOnSelect={false}
// //                     className="react-select-container"
// //                     classNamePrefix="react-select"
// //                   />
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </Card.Body>
// //       </Card>
// //       <Card className="mb-4 shadow-sm">
// //         <Card.Body className="row text-center">
// //           <div className="col-12 col-sm-6 mb-3 mb-md-0">
// //             <h6 className="text-muted mb-1">Total Stores</h6>
// //             <h5 className="mb-0 fw-semibold">{Object.keys(groupDataByStore()).length}</h5>
// //           </div>
// //           <div className="col-12 col-sm-6">
// //             <h6 className="text-muted mb-1">Total Token Usage</h6>
// //             <h5 className="mb-0 fw-semibold">{filteredUsers.reduce((sum, user) => sum + user.total_tokens, 0).toLocaleString()}</h5>
// //           </div>
// //         </Card.Body>
// //       </Card>
// //       {paginatedCharts.length === 0 ? (
// //         <div className="text-center py-5 bg-light rounded">
// //           <FaStore size={48} className="text-muted mb-3" />
// //           <h5 className="text-muted">No chart data available</h5>
// //           <p className="text-muted">Try selecting different filters or adjusting the search term</p>
// //         </div>
// //       ) : (
// //         <>
// //           <div className="row g-4">
// //             {paginatedCharts.map((chart, idx) => (
// //               <div key={idx} className="col-12 col-md-6 col-lg-4">
// //                 <div className="card shadow-sm h-100">
// //                   <div className="card-header bg-white border-bottom-0">
// //                     <h5 className="mb-0 text-primary">
// //                       <FaStore className="me-2" />
// //                       {chart.store} - Tokens {chart.totalTokens.toLocaleString()}
// //                     </h5>
// //                   </div>
// //                   <div className="card-body p-3">
// //                     <div style={{ height: '300px' }}>
// //                       <Bar
// //                         data={chart.data}
// //                         options={{
// //                           responsive: true,
// //                           maintainAspectRatio: false,
// //                           plugins: {
// //                             legend: {
// //                               display: true,
// //                               position: 'top',
// //                               labels: {
// //                                 boxWidth: 12,
// //                                 padding: 20,
// //                                 usePointStyle: true,
// //                               },
// //                             },
// //                             tooltip: {
// //                               backgroundColor: '#2e59d9',
// //                               titleFont: { size: 14 },
// //                               bodyFont: { size: 12 },
// //                               padding: 10,
// //                               displayColors: false,
// //                               callbacks: {
// //                                 label: (context) => `${context.raw.toLocaleString()} Tokens`,
// //                               },
// //                             },
// //                           },
// //                           scales: {
// //                             y: {
// //                               beginAtZero: true,
// //                               title: {
// //                                 display: true,
// //                                 text: 'Total Tokens',
// //                                 font: { weight: 'bold' },
// //                               },
// //                               grid: { drawBorder: false },
// //                               ticks: {
// //                                 callback: (value) => value.toLocaleString(),
// //                               },
// //                             },
// //                             x: {
// //                               title: {
// //                                 display: true,
// //                                 text: 'Month',
// //                                 font: { weight: 'bold' },
// //                               },
// //                               grid: { display: false },
// //                             },
// //                           },
// //                         }}
// //                       />
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>

// //           <div className="mt-4">
// //             <ReactPaginate
// //               previousLabel={'Previous'}
// //               nextLabel={'Next'}
// //               pageCount={chartPageCount}
// //               onPageChange={handlePageChange}
// //               marginPagesDisplayed={2} 
// //               pageRangeDisplayed={2}
// //               containerClassName={'pagination justify-content-center'}
// //               pageClassName={'page-item'}
// //               pageLinkClassName={'page-link'}
// //               previousClassName={'page-item'}
// //               previousLinkClassName={'page-link'}
// //               nextClassName={'page-item'}
// //               nextLinkClassName={'page-link'}
// //               breakClassName={'page-item'}
// //               breakLinkClassName={'page-link'}
// //               activeClassName={'active'}
// //               forcePage={currentPage}
// //             />
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default TokenHistory;

// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Spinner, Card, Button, Container, Row, Col } from 'react-bootstrap';
// import { FaStore, FaFilter, FaCalendarAlt, FaUsers, FaChartBar } from 'react-icons/fa';
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
// import ReactPaginate from 'react-paginate';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { CiBadgeDollar } from 'react-icons/ci';
// import { IoStorefront } from 'react-icons/io5';
// import { ImStarEmpty } from 'react-icons/im';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);
// const animatedComponents = makeAnimated();

// const TokenHistory = () => {
//   const [users, setUsers] = useState([]);
//   const [storeData, setStoreData] = useState([]);
//   const [structureClients, setStructureClients] = useState([]);
//   const [selectedStores, setSelectedStores] = useState([]);
//   const [selectedStructureClients, setSelectedStructureClients] = useState([]);
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [totalRemainTokens, setTotalRemainTokens] = useState(0);
//   const token = localStorage.getItem('access_token');
//   const clientType = localStorage.getItem('client_type');
//   const userid = localStorage.getItem('user_id');

//   // Chart pagination
//   const [currentPage, setCurrentPage] = useState(0);
//   const chartsPerPage = 6;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         let usersRes, storesRes, clientsRes;

//         if (clientType === 'admin') {
//           [usersRes, storesRes, clientsRes] = await Promise.all([
//             axios.get(`${process.env.REACT_APP_API_URL}/get-token-history`, {
//               headers: { Authorization: `Bearer ${token}` },
//             }),
//             axios.get(`${process.env.REACT_APP_API_URL}/admin/stores`, {
//               headers: { Authorization: `Bearer ${token}` },
//             }),
//             axios.get(`${process.env.REACT_APP_API_URL}/admin/structureclient`, {
//               headers: { Authorization: `Bearer ${token}` },
//             }),
//           ]);
//         } else {
//           [usersRes, storesRes] = await Promise.all([
//             axios.get(`${process.env.REACT_APP_API_URL}/get-token-history`, {
//               headers: { Authorization: `Bearer ${token}` },
//             }),
//             axios.get(`${process.env.REACT_APP_API_URL}/store/names`, {
//               headers: { Authorization: `Bearer ${token}` },
//             }),
//           ]);
//           clientsRes = { data: { clients: [] } };
//         }

//         const usersData = usersRes.data || [];
//         const remaintokens = usersData.filter((user) => user.client_id === Number(userid));
//         // Calculate total remain_tokens
//         const totalTokens = remaintokens.reduce((sum, user) => sum + (user.remain_tokens || 0), 0);
//         setTotalRemainTokens(totalTokens);

//         const normalizedUsers = usersData.map((user) => ({
//           ...user,
//           store_name: (user.store_name || user.index_name || 'Unknown Store').trim().toLowerCase(),
//           client_id: user.client_id ? String(user.client_id) : null,
//         }));

//         setUsers(normalizedUsers);
//         setStoreData(storesRes.data.stores || storesRes.data || []);
//         setStructureClients(clientsRes.data.clients || []);

//         if (normalizedUsers.length > 0) {
//           const dates = normalizedUsers.map((u) => new Date(u.created_at));
//           const minDate = new Date(Math.min(...dates));
//           const maxDate = new Date(Math.max(...dates));

//           setStartDate(minDate.toISOString().split('T')[0]);
//           setEndDate(maxDate.toISOString().split('T')[0]);
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Failed to load data. Please try again later.');
//         toast.error('Failed to load data. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [token, clientType]);

//   useEffect(() => {
//     setCurrentPage(0);
//   }, [selectedStores, selectedStructureClients, startDate, endDate]);

//   const normalizeDate = (dateString) => {
//     const date = new Date(dateString);
//     return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
//   };

//   const normalizeString = (str) => (str || '').toString().trim().toLowerCase();

//   const filteredUsers = users.filter((user) => {
//     const created = normalizeDate(user.created_at);
//     const userStoreName = normalizeString(user.store_name) || 'unknown store';
//     const userClientId = user.client_id ? String(user.client_id) : null;

//     const matchStore =
//       selectedStores.length === 0 ||
//       selectedStores.some(store =>
//         normalizeString(store.value) === userStoreName
//       );

//     const matchStructureClient =
//       clientType !== 'admin' ||
//       selectedStructureClients.length === 0 ||
//       (userClientId &&
//         selectedStructureClients.some(sc =>
//           String(sc.value) === userClientId
//         ));

//     const matchDate =
//       (!startDate || created >= normalizeDate(startDate)) &&
//       (!endDate || created <= normalizeDate(`${endDate}T23:59:59.999Z`));

//     return matchStore && matchStructureClient && matchDate;
//   });

//   const usersToRender = filteredUsers.length > 0 ? filteredUsers : users;

//   const groupDataByStoreAndDate = () => {
//     const grouped = {};

//     filteredUsers.forEach((entry) => {
//       const store = entry.store_name || 'Unknown Store';
//       const dateKey = new Date(entry.created_at).toISOString().split('T')[0];

//       if (!grouped[store]) {
//         grouped[store] = {
//           dates: {},
//           totalTokens: 0,
//           totalCost: 0
//         };
//       }

//       if (!grouped[store].dates[dateKey]) {
//         grouped[store].dates[dateKey] = {
//           tokens: 0,
//           cost: 0
//         };
//       }

//       grouped[store].dates[dateKey].tokens += entry.tokens_used || 0;
//       grouped[store].dates[dateKey].cost += entry.total_cost || 0;
//       grouped[store].totalTokens += entry.tokens_used || 0;
//       grouped[store].totalCost += entry.total_cost || 0;
//     });

//     return grouped;
//   };

//   const generateChartData = () => {
//     const groupedData = groupDataByStoreAndDate();
//     const charts = [];

//     Object.entries(groupedData).forEach(([store, storeData]) => {
//       const sortedDates = Object.keys(storeData.dates).sort((a, b) =>
//         new Date(a) - new Date(b)
//       );

//       const tokensData = sortedDates.map(date => storeData.dates[date].tokens);
//       const costData = sortedDates.map(date => storeData.dates[date].cost);

//       charts.push({
//         store,
//         totalTokens: storeData.totalTokens,
//         totalCost: storeData.totalCost,
//         data: {
//           labels: sortedDates,
//           datasets: [
//             {
//               label: 'Tokens Used',
//               data: tokensData,
//               yAxisID: 'y-tokens',
//               backgroundColor: 'rgba(54, 162, 235, 0.7)',
//               borderColor: 'rgba(54, 162, 235, 1)',
//               borderWidth: 1,
//               barPercentage: 0.4,
//               categoryPercentage: 0.8
//             },
//             {
//               label: 'Total Cost ($)',
//               data: costData,
//               yAxisID: 'y-cost',
//               backgroundColor: 'rgba(255, 159, 64, 0.7)',
//               borderColor: 'rgba(255, 159, 64, 1)',
//               borderWidth: 1,
//               barPercentage: 0.4,
//               categoryPercentage: 0.8
//             }
//           ]
//         }
//       });
//     });

//     return charts;
//   };

//   const storeOptions = storeData.map((store) => ({
//     value: normalizeString(store.name || 'Unknown Store'),
//     label: store.client_name ? `${store.name} (${store.client_name})` : store.name
//   }));

//   if (clientType === 'admin') {
//     storeOptions.push({
//       value: 'unknown store',
//       label: 'Unknown Store'
//     });
//   }

//   const structureClientOptions = structureClients.map((client) => ({
//     value: String(client.id),
//     label: client.email || `Client ${client.id}`
//   }));

//   const charts = generateChartData();
//   const chartPageCount = Math.ceil(charts.length / chartsPerPage);
//   const chartOffset = currentPage * chartsPerPage;
//   const paginatedCharts = charts.slice(chartOffset, chartOffset + chartsPerPage);

//   const handlePageChange = ({ selected }) => {
//     setCurrentPage(selected);
//   };

//   const handleClearFilter = () => {
//     setSelectedStores([]);
//     setSelectedStructureClients([]);

//     if (users.length > 0) {
//       const dates = users.map((u) => new Date(u.created_at));
//       const minDate = new Date(Math.min(...dates));
//       const maxDate = new Date(Math.max(...dates));

//       setStartDate(minDate.toISOString().split('T')[0]);
//       setEndDate(maxDate.toISOString().split('T')[0]);
//     } else {
//       setStartDate('');
//       setEndDate('');
//     }
//   };

//   if (loading) {
//     return (
//       <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
//         <Spinner animation="border" variant="primary" />
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
//         <div className="alert alert-danger">{error}</div>
//       </Container>
//     );
//   }

//   return (
//     <Container fluid className="py-4">
//       <ToastContainer position="top-right" autoClose={5000} />

//       <Row className="mb-4 align-items-center">
//         <Col>
//           <h1 className="h3 mb-0 text-gray-800">
//             <FaChartBar className="me-2" />
//             Token Usage Analytics
//           </h1>
//           <p className="mb-0 text-muted">Track token consumption and costs across stores</p>
//         </Col>
//         <Col xs="auto">
//           <Button variant="outline-primary" onClick={handleClearFilter}>
//             <FaFilter className="me-2" />
//             Reset Filters
//           </Button>
//         </Col>
//       </Row>

//       <Card className="mb-4 shadow">
//         <Card.Body>
//           <h5 className="card-title mb-4">
//             <FaFilter className="me-2 text-primary" />
//             Filter Options
//           </h5>

//           <Row className="g-3">
//             <Col md={6} lg={4}>
//               <div className="mb-3">
//                 <label className="form-label fw-semibold">
//                   <FaCalendarAlt className="me-2 text-muted" />
//                   Date Range
//                 </label>
//                 <div className="d-flex gap-2">
//                   <input
//                     type="date"
//                     className="form-control"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                   />
//                   <input
//                     type="date"
//                     className="form-control"
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                   />
//                 </div>
//               </div>
//             </Col>

//             <Col md={6} lg={3}>
//               <div className="mb-3">
//                 <label className="form-label fw-semibold">
//                   <FaStore className="me-2 text-muted" />
//                   Stores
//                 </label>
//                 <Select
//                   isMulti
//                   options={storeOptions}
//                   value={selectedStores}
//                   onChange={setSelectedStores}
//                   components={animatedComponents}
//                   placeholder="Select stores..."
//                   closeMenuOnSelect={false}
//                   className="react-select-container"
//                   classNamePrefix="react-select"
//                 />
//               </div>
//             </Col>



//             {clientType === 'admin' && (
//               <Col md={6} lg={3}>
//                 <div className="mb-3">
//                   <label className="form-label fw-semibold">
//                     <FaUsers className="me-2 text-muted" />
//                     Clients
//                   </label>
//                   <Select
//                     isMulti
//                     options={structureClientOptions}
//                     value={selectedStructureClients}
//                     onChange={setSelectedStructureClients}
//                     components={animatedComponents}
//                     placeholder="Select clients..."
//                     closeMenuOnSelect={false}
//                     className="react-select-container"
//                     classNamePrefix="react-select"
//                   />
//                 </div>
//               </Col>
//             )}
//             {/* {clientType === "client" && (<Col md={6} lg={3}>
//               <Card className="h-100 shadow-sm border-start-primary">
//                 <Card.Body>

//                 <label className="form-label fw-semibold">
//                   <FaStore className="me-2 text-muted" />
//                   Remain Tokens
//                 </label>
//                 <h3>${totalRemainTokens.toLocaleString()}</h3>
//                 </Card.Body>
//               </Card>
//             </Col>)} */}
//           </Row>
//         </Card.Body>
//       </Card>

//       <Row className="mb-4 g-3">
//         <Col md={3}>
//           <Card className="h-100 shadow-sm border-start-primary">
//             <Card.Body className="py-3">
//               <div className="d-flex align-items-center">
//                 <div className="me-3 bg-primary bg-opacity-10 p-3 rounded">
//                   <IoStorefront className="text-primary" size={20} />
//                 </div>
//                 <div>
//                   <h6 className="text-muted mb-1">Total Stores</h6>
//                   <h4 className="mb-0 fw-bold">{Object.keys(groupDataByStoreAndDate()).length}</h4>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="h-100 shadow-sm border-start-info">
//             <Card.Body className="py-3">
//               <div className="d-flex align-items-center">
//                 <div className="me-3 bg-info bg-opacity-10 p-3 rounded">
//                   <FaChartBar className="text-info" size={20} />
//                 </div>
//                 <div>
//                   <h6 className="text-muted mb-1">Total Token Usage</h6>
//                   <h4 className="mb-0 fw-bold">{usersToRender.reduce((sum, user) => sum + (user.tokens_used || 0), 0).toLocaleString()}</h4>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="h-100 shadow-sm border-start-warning">
//             <Card.Body className="py-3">
//               <div className="d-flex align-items-center">
//                 <div className="me-3 bg-warning bg-opacity-10 p-3 rounded">
//                   <CiBadgeDollar className="text-warning" size={25} />
//                 </div>
//                 <div>
//                   <h6 className="text-muted mb-1">Total Cost</h6>
//                   <h4 className="mb-0 fw-bold">${usersToRender.reduce((sum, user) => sum + (user.total_cost || 0), 0).toFixed(8)}</h4>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         {clientType === "client" && (<Col md={3}>
//           <Card className="h-100 shadow-sm border-start-warning">
//             <Card.Body className="py-3">
//               <div className="d-flex align-items-center">
//                 <div className="me-3 bg-success bg-opacity-10 p-3 rounded">
//                   <ImStarEmpty className="text-success" size={25} />
//                 </div>
//                 <div>
//                   <h6 className="text-muted mb-1"> Remain Tokens</h6>
//                   <h4 className="mb-0 fw-bold">${totalRemainTokens.toLocaleString()}</h4>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>)}


//       </Row>

//       {paginatedCharts.length === 0 ? (
//         <Card className="text-center py-5">
//           <Card.Body>
//             <FaStore size={48} className="text-muted mb-3" />
//             <h5 className="text-muted">No data available</h5>
//             <p className="text-muted">Try adjusting your filters to see results</p>
//             <Button variant="outline-primary" onClick={handleClearFilter}>
//               Reset Filters
//             </Button>
//           </Card.Body>
//         </Card>
//       ) : (
//         <>
//           <Row className="g-4">
//             {paginatedCharts.map((chart, idx) => (
//               <Col key={idx} xs={12} md={6} lg={4}>
//                 <Card className="h-100 shadow-sm">
//                   <Card.Header className="bg-white border-bottom-0 pb-0">
//                     <div className="d-flex align-items-center">
//                       <div className="bg-primary bg-opacity-10 p-2 rounded me-2">
//                         <FaStore className="text-primary" size={18} />
//                       </div>
//                       <div>
//                         <h5 className="mb-0">{chart.store}</h5>
//                         <small className="text-muted">
//                           Tokens: {chart.totalTokens.toLocaleString()} | Cost: ${chart.totalCost.toFixed(8)}
//                         </small>
//                       </div>
//                     </div>
//                   </Card.Header>
//                   <Card.Body className="p-3">
//                     <div style={{ height: '280px' }}>
//                       <Bar
//                         data={chart.data}
//                         options={{
//                           responsive: true,
//                           maintainAspectRatio: false,
//                           plugins: {
//                             legend: {
//                               display: true,
//                               position: 'top',
//                               labels: {
//                                 boxWidth: 12,
//                                 padding: 20,
//                                 usePointStyle: true,
//                               },
//                             },
//                             tooltip: {
//                               backgroundColor: '#2e59d9',
//                               titleFont: { size: 14 },
//                               bodyFont: { size: 12 },
//                               padding: 10,
//                               displayColors: false,
//                               callbacks: {
//                                 title: (context) => context[0].label,
//                                 label: (context) => {
//                                   if (context.dataset.label.includes('Tokens Used')) {
//                                     return `Tokens: ${context.raw.toLocaleString()}`;
//                                   } else {
//                                     return `Cost: $${context.raw.toFixed(8)}`;
//                                   }
//                                 },
//                               },
//                             },
//                           },
//                           scales: {
//                             x: {
//                               grid: { display: false },
//                               title: { display: true, text: 'Date', font: { weight: 'bold' } },
//                             },
//                             'y-tokens': {
//                               position: 'left',
//                               title: { display: true, text: 'Tokens Used', font: { weight: 'bold' } },
//                               ticks: { callback: (value) => value.toLocaleString() },
//                               grid: { drawOnChartArea: true },
//                             },
//                             'y-cost': {
//                               position: 'right',
//                               title: { display: true, text: 'Cost ($)', font: { weight: 'bold' } },
//                               ticks: { callback: (value) => value.toFixed(8) },
//                               grid: { drawOnChartArea: false },
//                             },
//                           },
//                         }}
//                       />
//                     </div>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>

//           {chartPageCount > 1 && (
//             <div className="mt-4 d-flex justify-content-center">
//               <ReactPaginate
//                 previousLabel={'Previous'}
//                 nextLabel={'Next'}
//                 pageCount={chartPageCount}
//                 onPageChange={handlePageChange}
//                 marginPagesDisplayed={2}
//                 pageRangeDisplayed={3}
//                 containerClassName={'pagination'}
//                 pageClassName={'page-item'}
//                 pageLinkClassName={'page-link'}
//                 previousClassName={'page-item'}
//                 previousLinkClassName={'page-link'}
//                 nextClassName={'page-item'}
//                 nextLinkClassName={'page-link'}
//                 breakClassName={'page-item'}
//                 breakLinkClassName={'page-link'}
//                 activeClassName={'active'}
//                 forcePage={currentPage}
//               />
//             </div>
//           )}
//         </>
//       )}
//     </Container>
//   );
// };

// export default TokenHistory;



import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Spinner, Card, Button, Container, Row, Col } from 'react-bootstrap';
import { FaStore, FaFilter, FaCalendarAlt, FaUsers, FaChartBar } from 'react-icons/fa';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CiBadgeDollar } from 'react-icons/ci';
import { IoStorefront } from 'react-icons/io5';
import { ImStarEmpty } from 'react-icons/im';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);
const animatedComponents = makeAnimated();

const TokenHistory = () => {
  const [users, setUsers] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [structureClients, setStructureClients] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedStructureClients, setSelectedStructureClients] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRemainTokens, setTotalRemainTokens] = useState(0);
  const token = localStorage.getItem('access_token');
  const clientType = localStorage.getItem('client_type');
  const userid = localStorage.getItem('user_id');

  // Chart pagination
  const [currentPage, setCurrentPage] = useState(0);
  const chartsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let usersRes, storesRes, clientsRes;

        if (clientType === 'admin') {
          [usersRes, storesRes, clientsRes] = await Promise.all([
            axios.get(`${process.env.REACT_APP_API_URL}/get-token-history`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${process.env.REACT_APP_API_URL}/admin/stores`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${process.env.REACT_APP_API_URL}/admin/structureclient`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);
        } else {
          [usersRes, storesRes] = await Promise.all([
            axios.get(`${process.env.REACT_APP_API_URL}/get-token-history`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${process.env.REACT_APP_API_URL}/store/names`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);
          clientsRes = { data: { clients: [] } };
        }

        const usersData = usersRes.data || [];
        const remaintokens = usersData.filter((user) => user.client_id === Number(userid));
        const totalTokens = remaintokens.reduce((sum, user) => sum + (user.remain_tokens || 0), 0);
        setTotalRemainTokens(totalTokens);

        const normalizedUsers = usersData.map((user) => ({
          ...user,
          store_name: (user.store_name || user.index_name || 'Unknown Store').trim().toLowerCase(),
          client_id: user.client_id ? String(user.client_id) : null,
        }));

        setUsers(normalizedUsers);
        setStoreData(storesRes.data.stores || storesRes.data || []);
        setStructureClients(clientsRes.data.clients || []);

        if (normalizedUsers.length > 0) {
          const dates = normalizedUsers.map((u) => new Date(u.created_at));
          const minDate = new Date(Math.min(...dates));
          const maxDate = new Date(Math.max(...dates));

          setStartDate(minDate.toISOString().split('T')[0]);
          setEndDate(maxDate.toISOString().split('T')[0]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        toast.error('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, clientType]);

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedStores, selectedStructureClients, startDate, endDate]);

  const normalizeDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  };

  const normalizeString = (str) => (str || '').toString().trim().toLowerCase();

  const filteredUsers = users.filter((user) => {
    const created = normalizeDate(user.created_at);
    const userStoreName = normalizeString(user.store_name) || 'unknown store';
    const userClientId = user.client_id ? String(user.client_id) : null;

    const matchStore =
      selectedStores.length === 0 ||
      selectedStores.some((store) => normalizeString(store.value) === userStoreName);

    const matchStructureClient =
      clientType !== 'admin' ||
      selectedStructureClients.length === 0 ||
      (userClientId &&
        selectedStructureClients.some((sc) => String(sc.value) === userClientId));

    const matchDate =
      (!startDate || created >= normalizeDate(startDate)) &&
      (!endDate || created <= normalizeDate(`${endDate}T23:59:59.999Z`));

    return matchStore && matchStructureClient && matchDate;
  });

  const usersToRender = filteredUsers.length > 0 ? filteredUsers : users;

  const groupDataByStoreAndDate = () => {
    const grouped = {};

    filteredUsers.forEach((entry) => {
      const store = entry.store_name || 'Unknown Store';
      const dateKey = new Date(entry.created_at).toISOString().split('T')[0];

      if (!grouped[store]) {
        grouped[store] = {
          dates: {},
          totalTokens: 0,
          totalCost: 0,
        };
      }

      if (!grouped[store].dates[dateKey]) {
        grouped[store].dates[dateKey] = {
          tokens: 0,
          cost: 0,
        };
      }

      grouped[store].dates[dateKey].tokens += entry.tokens_used || 0;
      grouped[store].dates[dateKey].cost += entry.total_cost || 0;
      grouped[store].totalTokens += entry.tokens_used || 0;
      grouped[store].totalCost += entry.total_cost || 0;
    });

    return grouped;
  };

  const generateChartData = () => {
    const groupedData = groupDataByStoreAndDate();
    const charts = [];

    Object.entries(groupedData).forEach(([store, storeData]) => {
      const sortedDates = Object.keys(storeData.dates).sort((a, b) => new Date(a) - new Date(b));

      const tokensData = sortedDates.map((date) => storeData.dates[date].tokens);
      const costData = sortedDates.map((date) => storeData.dates[date].cost);

      charts.push({
        store,
        totalTokens: storeData.totalTokens,
        totalCost: storeData.totalCost,
        data: {
          labels: sortedDates,
          datasets: [
            {
              label: 'Tokens Used',
              data: tokensData,
              yAxisID: 'y-tokens',
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              barPercentage: 0.4,
              categoryPercentage: 0.8,
            },
            {
              label: 'Total Cost ($)',
              data: costData,
              yAxisID: 'y-cost',
              backgroundColor: 'rgba(255, 159, 64, 0.7)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
              barPercentage: 0.4,
              categoryPercentage: 0.8,
            },
          ],
        },
      });
    });

    return charts;
  };

  // Filter stores based on selected clients (if API supports it)
  const storeOptions = storeData
    .filter((store) => {
      if (clientType !== 'admin' || selectedStructureClients.length === 0) return true;
      return selectedStructureClients.some(
        (client) => store.client_id && String(store.client_id) === String(client.value)
      );
    })
    .map((store) => ({
      value: normalizeString(store.name || 'Unknown Store'),
      label: clientType !== 'admin' ? store.name : `${store.name} (${store.client_name || 'Unknown Client'})`,
    }));

  if (clientType === 'admin') {
    storeOptions.push({
      value: 'unknown store',
      label: 'Unknown Store',
    });
  }

  const structureClientOptions = structureClients.map((client) => ({
    value: String(client.id),
    label: client.email || `Client ${client.id}`,
  }));

  const charts = generateChartData();
  const chartPageCount = Math.ceil(charts.length / chartsPerPage);
  const chartOffset = currentPage * chartsPerPage;
  const paginatedCharts = charts.slice(chartOffset, chartOffset + chartsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleClearFilter = () => {
    setSelectedStores([]);
    setSelectedStructureClients([]);

    if (users.length > 0) {
      const dates = users.map((u) => new Date(u.created_at));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));

      setStartDate(minDate.toISOString().split('T')[0]);
      setEndDate(maxDate.toISOString().split('T')[0]);
    } else {
      setStartDate('');
      setEndDate('');
    }
  };

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

  // Check if admin and no clients selected
  const isAdminNoClientsSelected = clientType === 'admin' && selectedStructureClients.length === 0;

  return (
    <Container fluid className="py-4">
      <ToastContainer position="top-right" autoClose={5000} />

      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="h3 mb-0 text-gray-800">
            <FaChartBar className="me-2" />
            Token Usage Analytics
          </h1>
          <p className="mb-0 text-muted">Track token consumption and costs across stores</p>
        </Col>
        <Col xs="auto">
          <Button variant="outline-primary" onClick={handleClearFilter}>
            <FaFilter className="me-2" />
            Reset Filters
          </Button>
        </Col>
      </Row>

      <Card className="mb-4 shadow">
        <Card.Body>
          <h5 className="card-title mb-4">
            <FaFilter className="me-2 text-primary" />
            Filter Options
          </h5>

          <Row className="g-3">
            <Col md={6} lg={4}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <FaCalendarAlt className="me-2 text-muted" />
                  Date Range
                </label>
                <div className="d-flex gap-2">
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <FaStore className="me-2 text-muted" />
                  Stores
                </label>
                <Select
                  isMulti
                  options={storeOptions}
                  value={selectedStores}
                  onChange={setSelectedStores}
                  components={animatedComponents}
                  placeholder="Select stores..."
                  closeMenuOnSelect={false}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  isDisabled={isAdminNoClientsSelected} // Disable if admin and no clients selected
                />
              </div>
            </Col>

            {clientType === 'admin' && (
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <FaUsers className="me-2 text-muted" />
                    Clients
                  </label>
                  <Select
                    isMulti
                    options={structureClientOptions}
                    value={selectedStructureClients}
                    onChange={setSelectedStructureClients}
                    components={animatedComponents}
                    placeholder="Select clients..."
                    closeMenuOnSelect={false}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      {isAdminNoClientsSelected ? (
  <Card className="text-center py-5">
    <Card.Body>
      <FaUsers size={48} className="text-muted mb-3" />
      <h5 className="text-muted">Please select at least one client</h5>
      <p className="text-muted">Select a client from the filter to view token usage analytics.</p>
    </Card.Body>
  </Card>
) : (
  <>
    <Row className="mb-4 g-3">
      <Col md={3}>
        <Card className="h-100 shadow-sm border-start-primary">
          <Card.Body className="py-3">
            <div className="d-flex align-items-center">
              <div className="me-3 bg-primary bg-opacity-10 p-3 rounded">
                <IoStorefront className="text-primary" size={20} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Stores</h6>
                <h4 className="mb-0 fw-bold">{Object.keys(groupDataByStoreAndDate()).length}</h4>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="h-100 shadow-sm border-start-info">
          <Card.Body className="py-3">
            <div className="d-flex align-items-center">
              <div className="me-3 bg-info bg-opacity-10 p-3 rounded">
                <FaChartBar className="text-info" size={20} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Token Usage</h6>
                <h4 className="mb-0 fw-bold">{usersToRender.reduce((sum, user) => sum + (user.tokens_used || 0), 0).toLocaleString()}</h4>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="h-100 shadow-sm border-start-warning">
          <Card.Body className="py-3">
            <div className="d-flex align-items-center">
              <div className="me-3 bg-warning bg-opacity-10 p-3 rounded">
                <CiBadgeDollar className="text-warning" size={25} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Cost</h6>
                <h4 className="mb-0 fw-bold">${usersToRender.reduce((sum, user) => sum + (user.total_cost || 0), 0).toFixed(8)}</h4>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      {clientType === 'client' && (
        <Col md={3}>
          <Card className="h-100 shadow-sm border-start-warning">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="me-3 bg-success bg-opacity-10 p-3 rounded">
                  <ImStarEmpty className="text-success" size={25} />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Remain Tokens</h6>
                  <h4 className="mb-0 fw-bold">{totalRemainTokens.toLocaleString()}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      )}
    </Row>

    {paginatedCharts.length === 0 ? (
      <Card className="text-center py-5">
        <Card.Body>
          <FaStore size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No data available</h5>
          <p className="text-muted">Try adjusting your filters to see results</p>
          <Button variant="outline-primary" onClick={handleClearFilter}>
            Reset Filters
          </Button>
        </Card.Body>
      </Card>
    ) : (
      <>
        <Row className="g-4">
          {paginatedCharts.map((chart, idx) => (
            <Col key={idx} xs={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-white border-bottom-0 pb-0">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 p-2 rounded me-2">
                      <FaStore className="text-primary" size={18} />
                    </div>
                    <div>
                      <h5 className="mb-0">{chart.store}</h5>
                      <small className="text-muted">
                        Tokens: {chart.totalTokens.toLocaleString()} | Cost: ${chart.totalCost.toFixed(8)}
                      </small>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="p-3">
                  <div style={{ height: '280px' }}>
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
                            },
                          },
                          tooltip: {
                            backgroundColor: '#2e59d9',
                            titleFont: { size: 14 },
                            bodyFont: { size: 12 },
                            padding: 10,
                            displayColors: false,
                            callbacks: {
                              title: (context) => context[0].label,
                              label: (context) => {
                                if (context.dataset.label.includes('Tokens Used')) {
                                  return `Tokens: ${context.raw.toLocaleString()}`;
                                } else {
                                  return `Cost: $${context.raw.toFixed(8)}`;
                                }
                              },
                            },
                          },
                        },
                        scales: {
                          x: {
                            grid: { display: false },
                            title: { display: true, text: 'Date', font: { weight: 'bold' } },
                          },
                          'y-tokens': {
                            position: 'left',
                            title: { display: true, text: 'Tokens Used', font: { weight: 'bold' } },
                            ticks: { callback: (value) => value.toLocaleString() },
                            grid: { drawOnChartArea: true },
                          },
                          'y-cost': {
                            position: 'right',
                            title: { display: true, text: 'Cost ($)', font: { weight: 'bold' } },
                            ticks: { callback: (value) => value.toFixed(8) },
                            grid: { drawOnChartArea: false },
                          },
                        },
                      }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {chartPageCount > 1 && (
          <div className="mt-4 d-flex justify-content-center">
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              pageCount={chartPageCount}
              onPageChange={handlePageChange}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              containerClassName={'pagination'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item'}
              previousLinkClassName={'page-link'}
              nextClassName={'page-item'}
              nextLinkClassName={'page-link'}
              breakClassName={'page-item'}
              breakLinkClassName={'page-link'}
              activeClassName={'active'}
              forcePage={currentPage}
            />
          </div>
        )}
      </>
    )}
  </>
)}
    </Container>
  );
};

export default TokenHistory;