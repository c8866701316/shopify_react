import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Form, Tab, Table, Tabs } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import Moment from "react-moment";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
const Page1 = () => {
  const token = localStorage.getItem('access_token');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeDetails, setStoreDetails] = useState(null);
  const [storeId, setStoreId] = useState("");
  // const [trainingList,setTraininglist] =([])
  //  console.log("+++",trainingList)
  const [retryCount, setRetryCount] = useState(0);
  const [attemptTimes, setAttemptTimes] = useState([]);




  const handleAddModalClose = () => setShowAddModal(false);
  const handleAddModalShow = () => setShowAddModal(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const storesPerPage = 5; // Number of items per page


  const handleDetailsModalClose = () => {
    setShowDetailsModal(false);
    setSelectedStore(null);
  };

  const handleDetailsModalShow = (store) => {
    setStoreId(store.id)
    setSelectedStore(store);
    setShowDetailsModal(true);
    fetchStoreDetails(store.id)
  };
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newStore, setNewStore] = useState({
    name: "",
    api: "",
    url: "",
    api_key: "",
    sec_key: "",
    acc_token: "",
    status: "active",
  });

  const handleidChange = (event) => {
    setStoreId(event.target.value);
  };


  useEffect(() => {
    fetchStores();
    fetchStoreDetails();
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
      // setTraininglist(response.data.stores)
    } catch (error) {
      console.error("Error fetching store details:", error.response ? error.response.data : error.message);
    }
  };
  const handleChange = (e) => {
    setNewStore({ ...newStore, [e.target.name]: e.target.value });
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
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding store:", error.response ? error.response.data : error.message);
    }
  };
  // const addTraining = async () => {
  //   try {
  //     setLoading(true);
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 5000);
  //     // const storeId = document.getElementById('storeid').value;
  //     if (!storeId) {
  //       toast.error('Please enter a Store ID.');
  //       return;
  //     }
  //     const response = await axios.post(`${process.env.REACT_APP_API_URL}/train`, {
  //       StoreID: storeId, // Sending storeId in request body
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       }
  //     });
  //     if (response.data?.id) {
  //       // setTrainingId(response.data.id);
  //       alert(`Training added! ID: ${response.data.id}`);
  //     }
  //   } catch (error) {
  //     console.error('Error adding training:', error);
  //     alert('Failed to add training.');

  //   }
  // };
  const addTraining = async () => {
    if (retryCount >= 3) return; // Stop if retry limit is reached

    try {
      setLoading(true);

      // Store the current attempt time
      const currentTime = new Date().toLocaleTimeString();
      setAttemptTimes((prev) => [...prev.slice(-2), currentTime]); // Keep only last 3 attempts

      if (!storeId) {
        toast.error("Please enter a Store ID.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/train`,
        { StoreID: storeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.id) {
        alert(`Training added! ID: ${response.data.id}`);
        setRetryCount(0); // Reset retry count on success
        setAttemptTimes([]); // Clear attempt times on success
      }
    } catch (error) {
      console.error("Error adding training:", error);
      // alert(`Failed to add training at ${currentTime}`);
      setRetryCount((prev) => prev + 1);
    } finally {
      setTimeout(() => setLoading(false), 5000); // Ensure loading stops after 5s
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
      <div className="d-flex flex-column align-items-center ">
        <div className="w-100">
          <div className="card p-3 w-100">
            <div className="d-flex justify-content-end gap-2">
              {/* <Button variant="primary" onClick={handleDetailsModalShow}>
                Trainig
              </Button> */}
              <Button variant="primary" onClick={handleAddModalShow}>
                Store Add+
              </Button>
            </div>
            <h2 className="text-center">Store List</h2>
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
                    {/* {console.log("+++",currentStores)} */}

                    {currentStores.map((store, index) => (


                      <tr key={index} style={{ cursor: "pointer" }}>
                        <td>{index + 1}</td>
                        <td>{store.name}</td>
                        <td>{store.api}</td>
                        <td>
                          <Moment format="DD/MM/YYYY">
                            {store.created_at}
                          </Moment>
                        </td>
                        <td>{store.status}</td>
                        <td>
                          {/* {store.} */}
                          <Button onClick={() => handleDetailsModalShow(store)}>Training</Button>
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
        <Modal show={showAddModal} onHide={handleAddModalClose}>
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
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <div className="d-flex justify-content-between w-100">
            <Modal.Title>Store Details</Modal.Title>
            {/* <Button>Trainig Now</Button> */}
          </div>
          {/* <Modal.Title>Store Details</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          {storeDetails ? (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Training id</th>
                  </tr>
                </thead>
                <tbody>
                  {storeDetails.trainings && storeDetails.trainings.length > 0 ? (
                    storeDetails.trainings.map((training, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{training.client_id}</td>
                        <td>{training.training_id}</td>
                      </tr>
                    ))
                  ) : (

                    <tr>
                      <td colSpan="2" className="text-center d-flex justify-content-between flex-column">
                        <div>
                          <strong>Last 3 Attempt Times:</strong>
                          <ul>
                            {attemptTimes.map((time, index) => (
                              <li key={index}>{time}</li>
                            ))}
                          </ul>
                        </div>

                        <p>No trainings available</p>

                        <input
                          type="text"
                          name="storeid"
                          id="storeid"
                          value={storeId}
                          onChange={handleidChange}
                        />

                        <Button onClick={addTraining} disabled={loading || retryCount >= 3}>
                          {loading ? "Loading..." : retryCount >= 3 ? "Retry Limit Reached" : "Add Training"}
                        </Button>

                        {retryCount >= 3 && (
                          <Button onClick={() => { setRetryCount(0); setAttemptTimes([]); }}>
                            Retry
                          </Button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Store Details Modal */}
      {/* {selectedStore && (
        <Modal show={showDetailsModal} onHide={handleDetailsModalClose}>
          <Modal.Header closeButton>
            <div className="d-flex justify-content-between w-100">
              <Modal.Title>Store Details</Modal.Title>
              <Button>Trainig Now</Button>
            </div>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Store Name:</strong> {selectedStore.name}</p>
            <p><strong>API URL:</strong> {selectedStore.api}</p>
            <p><strong>Website URL:</strong> {selectedStore.url}</p>
            <p><strong>API Key:</strong> {selectedStore.api_key}</p>
            <p><strong>Secret Key:</strong> {selectedStore.sec_key}</p>
            <p><strong>Access Token:</strong> {selectedStore.acc_token}</p>
            <p><strong>Status:</strong> {selectedStore.status}</p>
            <p><strong>Created At:</strong> <Moment format="DD/MM/YYYY">{selectedStore.created_at}</Moment></p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDetailsModalClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      )} */}
    </>
  );
};

export default Page1;

{/* <tr>
                      <td colSpan="2" className="text-center d-flex justify-content-between flex-column">
                        <p>
                          No trainings available
                        </p>
                        
                        <input type="text" name="storeid" id="storeid" value={storeId}  onChange={handleidChange}  />
                        <Button onClick={addTraining}>{loading ? "Loading..." : "Add Training"}</Button>
                      </td>
                    </tr> */}