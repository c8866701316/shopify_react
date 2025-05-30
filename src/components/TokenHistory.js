import axios from 'axios';
import React, { useEffect, useState } from 'react';
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
import { Spinner, Form, Card, Button } from 'react-bootstrap';
import { FaStore } from 'react-icons/fa';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
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
  const token = localStorage.getItem('access_token');
  const clientType = localStorage.getItem('client_type'); // 'admin' or 'client'

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
            axios.get(`${process.env.REACT_APP_API_URL}/admin/get-token-history`, {
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
            axios.get(`${process.env.REACT_APP_API_URL}/admin/get-token-history`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${process.env.REACT_APP_API_URL}/store/names`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);
          clientsRes = { data: { clients: [] } };
        }

        const usersData = usersRes.data.data || [];
        setUsers(usersData);
        setStoreData(storesRes.data.stores || storesRes.data || []);
        setStructureClients(clientsRes.data.clients || []);

        // 👇 Auto-select date range from data
        if (usersData.length > 0) {
          const dates = usersData.map(u => new Date(u.created_at));
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

  const getFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('default', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredUsers = users.filter((user) => {
    const created = new Date(user.created_at);
    const matchStore =
      selectedStores.length === 0 ||
      (user.store_name && selectedStores.some((store) => store.value === user.store_name)) ||
      (!user.store_name && selectedStores.some((store) => store.value === 'Unknown Store'));

    const matchStructureClient =
      clientType !== 'admin' ||
      selectedStructureClients.length === 0 ||
      (user.structure_client_id &&
        selectedStructureClients.some((sc) => sc.value === user.structure_client_id));

    const matchDate =
      (!startDate || created >= new Date(startDate)) &&
      (!endDate || created <= new Date(endDate));

    return matchStore && matchStructureClient && matchDate;
  });

  const groupDataByStore = () => {
    const grouped = {};

    filteredUsers.forEach((entry) => {
      const store = entry.store_name || 'Unknown Store';
      const date = getFullDate(entry.created_at);
      const tokens = entry.total_tokens || 0;

      if (!grouped[store]) {
        grouped[store] = {
          months: {}, // Store date-wise token data
          totalTokens: 0, // Initialize totalTokens
        };
      }

      if (!grouped[store].months[date]) {
        grouped[store].months[date] = 0;
      }

      grouped[store].months[date] += tokens;
      grouped[store].totalTokens += tokens; // Accumulate totalTokens
    });

    return grouped;
  };

  const generateChartData = (data) => {
    return Object.entries(data)
      .map(([store, storeData]) => {
        const sortedEntries = Object.entries(storeData.months).sort(
          ([a], [b]) => new Date(a) - new Date(b)
        );

        const labels = sortedEntries.map(([date]) => date);
        const values = sortedEntries.map(([, value]) => value);

        return {
          store,
          totalTokens: storeData.totalTokens, // Include totalTokens
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
      })
      .sort((a, b) => b.totalTokens - a.totalTokens); // Sort by totalTokens (descending)
  };

  const storeOptions = [
    ...storeData.map((store) => ({
      value: store.name,
      label: store.client_name ? `${store.name} (${store.client_name})` : store.name,
    })),
    ...(clientType === 'admin' ? [{ value: 'Unknown Store', label: 'Unknown Store' }] : []),
  ];

  const structureClientOptions = structureClients.map((client) => ({
    value: client.id,
    label: client.email,
  }));

  const charts = generateChartData(groupDataByStore());
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
      const dates = users.map(u => new Date(u.created_at));
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
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ToastContainer />
      <div className="d-sm-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Store-wise Token Usage</h2>
        <div className="d-flex align-items-center gap-2">
          <Button variant="primary" onClick={handleClearFilter}>
            Clear All Filters
          </Button>
        </div>
      </div>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <div className="row g-3">
            {/* Date Range */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="h-100">
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <div className="w-100">
                    <label className="form-label fw-semibold mb-2">From</label>
                    <input
                      type="date"
                      className="form-control"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="w-100">
                    <label className="form-label fw-semibold mb-2">To</label>
                    <input
                      type="date"
                      className="form-control"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Store Filter */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="h-100">
                <label className="form-label fw-semibold mb-2">Filter by Stores</label>
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
                />
              </div>
            </div>

            {/* Structure Clients Filter (Admin only) */}
            {clientType === 'admin' && (
              <div className="col-12 col-md-6 col-lg-4">
                <div className="h-100">
                  <label className="form-label fw-semibold mb-2">Filter by Structure Clients</label>
                  <Select
                    isMulti
                    options={structureClientOptions}
                    value={selectedStructureClients}
                    onChange={setSelectedStructureClients}
                    components={animatedComponents}
                    placeholder="Select structure clients..."
                    closeMenuOnSelect={false}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
      <Card className="mb-4 shadow-sm">
        <Card.Body className="row text-center">
          <div className="col-12 col-sm-6 mb-3 mb-md-0">
            <h6 className="text-muted mb-1">Total Stores</h6>
            <h5 className="mb-0 fw-semibold">{Object.keys(groupDataByStore()).length}</h5>
          </div>
          <div className="col-12 col-sm-6">
            <h6 className="text-muted mb-1">Total Token Usage</h6>
            <h5 className="mb-0 fw-semibold">{filteredUsers.reduce((sum, user) => sum + user.total_tokens, 0).toLocaleString()}</h5>
          </div>
        </Card.Body>
      </Card>
      {paginatedCharts.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <FaStore size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No chart data available</h5>
          <p className="text-muted">Try selecting different filters or adjusting the search term</p>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {paginatedCharts.map((chart, idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm h-100">
                  <div className="card-header bg-white border-bottom-0">
                    <h5 className="mb-0 text-primary">
                      <FaStore className="me-2" />
                      {chart.store} - Tokens {chart.totalTokens.toLocaleString()}
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
                              },
                            },
                            tooltip: {
                              backgroundColor: '#2e59d9',
                              titleFont: { size: 14 },
                              bodyFont: { size: 12 },
                              padding: 10,
                              displayColors: false,
                              callbacks: {
                                label: (context) => `${context.raw.toLocaleString()} Tokens`,
                              },
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: 'Total Tokens',
                                font: { weight: 'bold' },
                              },
                              grid: { drawBorder: false },
                              ticks: {
                                callback: (value) => value.toLocaleString(),
                              },
                            },
                            x: {
                              title: {
                                display: true,
                                text: 'Month',
                                font: { weight: 'bold' },
                              },
                              grid: { display: false },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              pageCount={chartPageCount}
              onPageChange={handlePageChange}
              marginPagesDisplayed={2} 
              pageRangeDisplayed={2}
              containerClassName={'pagination justify-content-center'}
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
        </>
      )}
    </div>
  );
};

export default TokenHistory;