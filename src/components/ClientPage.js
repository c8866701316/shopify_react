import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const ClientPage = ({ role }) => {
    if (role === 'client') {
        window.history.back();
    }
    const token = localStorage.getItem('access_token');
    const [stores, setStores] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const offset = currentPage * itemsPerPage;
    const currentStores = stores.slice(offset, offset + itemsPerPage);
    const [showModal, setShowModal] = useState(false);
    const [newClient, setNewClient] = useState({ });

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/structureclient`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStores(response.data.clients || []);
        } catch (error) {
            console.error("Error fetching stores:", error.response ? error.response.data : error.message);
        }
    };

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleAddClient = async () => {
        setShowModal(false);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin/clients`, newClient, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success(response.data.message || "Client added successfully");
            setNewClient({ });
            fetchStores();
        } catch (error) {
            console.error("Error adding client:", error.response ? error.response.data : error.message);
            toast.error(error.response?.data?.message || "Failed to add client");
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/admin/clients/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Deleted!", response.data.message, "success");
            fetchStores();
        } catch (error) {
            console.error("Error deleting client:", error.response ? error.response.data : error.message);
            Swal.fire("Error!", error.response?.data?.message || "Failed to delete client", "error");
        }
    };
    

    const confirmDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(id);
            }
        });
    };

    return (
        <div className="p-4">
            <div className='py-2 d-flex flex-column flex-sm-row justify-content-between align-items-center'>
                <h2 className='mb-3 mb-md-0'>Clients</h2>
                <Button className='px-4' onClick={() => setShowModal(true)}>+ Add</Button>
            </div>
            <div className="table-responsive">
                <Table striped bordered hover className="text-center">
                    <thead>
                        <tr>
                            <th>Sr No.</th>
                            <th>Date</th>
                            <th>Email</th>
                            <th>No of Store</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStores.map((client, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{client.created_at || 'N/A'}</td>
                                <td>{client.email || 'N/A'}</td>
                                <td>{client.no_of_stores || 0}</td>
                                <td>
                                    {/* <Button variant="info" className="m-1">View</Button>
                                    <Button variant="warning" className="m-1">Edit</Button> */}
                                    <Button variant="danger" className="m-1" onClick={() => confirmDelete(client.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <div className="d-flex justify-content-center">
                <ReactPaginate
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    pageCount={Math.ceil(stores.length / itemsPerPage)}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                />
            </div>

            {/* Add Client Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Client</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={newClient.email || ''}
                                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={newClient.password || ''}
                                onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleAddClient}>Add Client</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ClientPage;
