import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Form, Tab, Table, Tabs } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import Moment from "react-moment";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
const Page1 = ({ role }) => {
  if (role === 'admin') {
    window.history.back()
  }
  const token = localStorage.getItem('access_token');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [latestModel, setLatestModel] = useState(false);
  const [storeDetails, setStoreDetails] = useState(null);
  const [latestTrainingData, setLatestTrainingData] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const handleAddModalClose = () => setShowAddModal(false);
  const handleAddModalShow = () => setShowAddModal(true);
  // console.log(latestTrainingData, "latestTrainingData.training.try");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const storesPerPage = 5; // Number of items per page

  const handleDetailsModalClose = () => {
    // setShowDetailsModal(false);
    setSelectedStore(null);
    setLatestModel(false)
  };

  const handleDetailsModalShow = (store) => {
    setSelectedStore(store);
    setShowDetailsModal(true);
    fetchStoreDetails(store.id)
  };

  // const handlelatestModelClick = (event) => {
  //   setLatestModel(true)
  // }
  const initialStoreState = {
    name: "",
    api: "",
    url: "",
    api_key: "",
    sec_key: "",
    acc_token: "",
    status: "active",
  };
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newStore, setNewStore] = useState(initialStoreState);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/store/names`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStores(response.data.stores);
    } catch (error) {
      console.error("Error fetching stores:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };
  // Fetch store details by store_id

  const fetchStoreDetails = async (storeId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/trainlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Find the store by storeId
      const store = response.data.stores.find(s => s.store_id === storeId);
      setStoreDetails(store || null); // Set store details or null if not found
    } catch (error) {
      console.error("Error fetching store details:", error.response ? error.response.data : error.message);
    }
  };
  const handleChange = (e) => {
    setNewStore({ ...newStore, [e.target.name]: e.target.value });
  };

  const handlelatestModelClick = async (training_id) => {
    setLatestModel(true); // Open the modal
    await fetchLatestTrainingData(training_id); // Initial fetch

    // Clear any existing interval before starting a new one
    if (intervalId) {
      clearInterval(intervalId);
    }

    // Start the interval to fetch data every 10 seconds
    const id = setInterval(() => {
      fetchLatestTrainingData(training_id);
    }, 10000);
    setIntervalId(id);
  };
  const handleCloseModal = () => {
    setLatestModel(false); // Close the modal
    setLatestTrainingData(null); // Optionally reset the training data
    // Clear the interval when the modal closes
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  useEffect(() => {
    // Cleanup interval on component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const fetchLatestTrainingData = async (training_id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/latest-training/${training_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLatestTrainingData(response.data.training);
    } catch (error) {
      console.error("Error fetching latest training data:", error.response ? error.response.data : error.message);
      toast.error("Failed to fetch latest training data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/store`, newStore, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      fetchStores(); // Refresh store list
      setNewStore(initialStoreState); // Clear the form
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding store:", error.response ? error.response.data : error.message);
    }
  };
  const addTraining = async () => {
    try {
      const storeId = document.getElementById('storeid').value;
      if (!storeId) {
        toast.error('Please enter a Store ID.');
        return;
      }
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/train`, {
        store_id: +storeId, // Sending storeId in request body
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (response) {
        // setTrainingId(response.data.id);
        // alert(`Training added! ID: ${response.data.id}`);
        setShowDetailsModal(false);
        toast.success('Training added successfully!')
      }
    } catch (error) {
      console.error('Error adding training:', error);
      toast.error('Failed to add training.'); // Display error message
      // alert('Failed to add training.');
    }
  };
  const handleRetry = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/admin/reset-try/${latestTrainingData.training_id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (response.status === 200) {
        // Handle successful retry, maybe refresh the data or show a success message
        toast.success('Retry successful');
        setLatestModel(false); // Close the modal
        setShowDetailsModal(false)
      }
    } catch (error) {
      console.error('Error retrying training:', error);
      toast.error('Failed to retry training');
    }
  };
  // Pagination Logic
  const pageCount = Math.ceil(stores.length / storesPerPage);
  const offset = currentPage * storesPerPage;
  const currentStores = stores.slice(offset, offset + storesPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  return (
    <>
      <div className="d-flex flex-column align-items-center p-3">
        <div className="w-100">
          <div className="card p-3 w-100">
            <div className="d-flex justify-content-end gap-2 p-3">
              {/* <Button variant="primary" onClick={handleDetailsModalShow}>
                Trainig
              </Button> */}
              <Button variant="primary" onClick={handleAddModalShow}>
                Store Add+
              </Button>
            </div>
            {/* <h2 className="text-center">Store List</h2> */}
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Store Name</th>
                      <th>API URL</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStores.map((store, index) => (
                      <tr key={index} onClick={() => handleDetailsModalShow(store)} style={{ cursor: "pointer" }}>
                        <td>{index + 1}</td>
                        <td>{store.name}</td>
                        <td>{store.api}</td>
                        <td>
                          <Moment format="DD/MM/YYYY hh:mm A">
                            {store.created_at}
                          </Moment>
                        </td>
                        <td>{store.status}</td>
                        <td>
                          <Button>Training</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {/* Pagination Component */}
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination justify-content-center"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
              </>
            )}

          </div>
          {/* <Tabs
            defaultActiveKey="success"
            id="justify-tab-example"
            className="mb-3 w-25"
            style={{ backgroundColor: "#6f6767", padding: "5px", width: "50%", margin: "auto" }}
            justify
          >
            <Tab eventKey="success" title="success" style={{ borderRadius: "30px" }}>
             
            </Tab>
            <Tab eventKey="fail" title="fail">
              <div className="text-center">
                working process...
              </div>
            </Tab>
          </Tabs> */}
        </div>
      </div>
      <div className="d-flex justify-content-center ">
        <Modal show={showAddModal} onHide={handleAddModalClose} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Add Store</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Store Name</Form.Label>
                <Form.Control type="text" name="name" value={newStore.name} onChange={handleChange} required />
              </Form.Group>

              <Form.Group>
                <Form.Label>API URL</Form.Label>
                <Form.Control type="text" name="api" value={newStore.api} onChange={handleChange} required />
              </Form.Group>

              <Form.Group>
                <Form.Label>Website URL</Form.Label>
                <Form.Control type="text" name="url" value={newStore.url} onChange={handleChange} required />
              </Form.Group>

              <Form.Group>
                <Form.Label>API Key</Form.Label>
                <Form.Control type="text" name="api_key" value={newStore.api_key} onChange={handleChange} required />
              </Form.Group>

              <Form.Group>
                <Form.Label>Secret Key</Form.Label>
                <Form.Control type="text" name="sec_key" value={newStore.sec_key} onChange={handleChange} required />
              </Form.Group>

              <Form.Group>
                <Form.Label>Access Token</Form.Label>
                <Form.Control type="text" name="acc_token" value={newStore.acc_token} onChange={handleChange} required />
              </Form.Group>

              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Control as="select" name="status" value={newStore.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Control>
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">
                Add Store
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
      {/* Details Modal */}
      {/* Details Modal */}
      <Modal show={showDetailsModal} onHide={() => { setShowDetailsModal(false); setStoreDetails({ name: '' }) }} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Training List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {storeDetails ? (
            <>
              <Table striped bordered hover responsive >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Training id</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {storeDetails.trainings && storeDetails.trainings.length > 0 ? (
                    storeDetails.trainings.map((training, index) => (
                      <tr key={index} onClick={() => handlelatestModelClick(training.training_id)} style={{ cursor: 'pointer' }}>
                        <td>{index + 1}</td>
                        <td>{training.client_id}</td>
                        <td>{training.training_id}</td>
                        <td>
                          <Moment format="DD/MM/YYYY hh:mm A">
                            {training.created_at}
                          </Moment>
                        </td>
                        <td>{training.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        <p>No trainings available</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Display "Training Now" button and input field if no trainings exist */}
              {(!storeDetails.trainings || storeDetails.trainings.length === 0) && (
                <div className="mt-3">
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="text"
                      id="storename"
                      placeholder="Enter Store Name"
                      className="form-control"
                      defaultValue={storeDetails.name} // Pre-fill with store name if available
                      disabled // Disable the input to prevent user modification
                    />
                    <input
                      type="hidden"
                      id="storeid"
                      defaultValue={storeDetails.store_id} // Pre-fill with store ID if available
                    />
                    <Button onClick={addTraining}>Training Now</Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Store Details Modal */}
      <Modal show={latestModel} onHide={handleCloseModal} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <div className="d-flex justify-content-between w-100">
            <Modal.Title>Training Details</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Client ID</th>
                <th>Training ID</th>
                <th>Created At</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {latestTrainingData ? (
                <tr>
                  <td>1</td>
                  <td>{latestTrainingData.client_id}</td>
                  <td>{latestTrainingData.training_id}</td>
                  <td>{new Date(latestTrainingData.created_at).toLocaleString()}</td>
                  <td>
                    {latestTrainingData.try >= 3 && latestTrainingData.error_message ? (
                      <span style={{ color: "red" }}>Error: {latestTrainingData.error_message}</span>
                    ) : (
                      latestTrainingData.status
                    )}
                  </td>
                  <td>
                    {latestTrainingData.try >= 3 && latestTrainingData.error_message ? (
                      <Button variant="danger" onClick={handleRetry}>
                        Retry
                      </Button>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    <p>No training data available</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <Modal show={latestModel} onHide={() => setLatestModel(false)} size="lg">
        <Modal.Header closeButton>
          <div className="d-flex justify-content-between w-100">
            <Modal.Title>Training Details</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Client ID</th>
                <th>Training ID</th>
                <th>Created At</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {latestTrainingData ? ( // Ensure `latestTrainingData` exists
                <tr>
                  <td>1</td>
                  <td>{latestTrainingData.client_id}</td>
                  <td>{latestTrainingData.training_id}</td>
                  <td>{new Date(latestTrainingData.created_at).toLocaleString()}</td>
                  <td>
                    {latestTrainingData.try >= 3 && latestTrainingData.error_message ? (
                      <span style={{ color: "red" }}>Error: {latestTrainingData.error_message}</span>
                    ) : (
                      latestTrainingData.status
                    )}
                  </td>
                  <td>
                    {latestTrainingData.try >= 3 && latestTrainingData.error_message ? (
                      <Button variant="danger" onClick={handleRetry}>
                        Retry
                      </Button>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    <p>No training data available</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setLatestModel(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}


    </>
  );
};

export default Page1;