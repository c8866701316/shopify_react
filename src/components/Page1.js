import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Form, Tab, Table, Tabs } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
const Page1 = () => {
  const token = localStorage.getItem('access_token');
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
      setShow(false);
    } catch (error) {
      console.error("Error adding store:", error.response ? error.response.data : error.message);
    }
  };
  return (
    <>
      <div className="d-flex flex-column align-items-center ">
        <div className="w-100">
          <Tabs
            defaultActiveKey="success"
            id="justify-tab-example"
            className="mb-3 w-25"
            style={{ backgroundColor: "#6f6767", padding: "5px", width: "50%", margin: "auto" }}
            justify
          >
            <Tab eventKey="success" title="success" style={{ borderRadius: "30px" }}>
              <div className="card p-3 w-100">
                <div className="d-flex justify-content-end">
                  <Button variant="primary" onClick={handleShow}>
                    Store Add+
                  </Button>
                </div>
                <h2 className="text-center">Store List</h2>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Store Name</th>
                        <th>API URL</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stores.map((store, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{store.name}</td>
                          <td>{store.api}</td>
                          <td>{store.created_at}</td>
                          <td>{store.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}

              </div>
            </Tab>
            <Tab eventKey="fail" title="fail">
              <div className="text-center">
                working process...
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
      <div className="d-flex justify-content-center ">
        <Modal show={show} onHide={() => setShow(false)}>
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
    </>
  );
};

export default Page1;