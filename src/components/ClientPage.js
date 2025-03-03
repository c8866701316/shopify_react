import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

const ClientPage = ({ role }) => {
    if (role === 'client') {
        window.history.back()
    }
    const token = localStorage.getItem('access_token');
    const [stores, setStores] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10; // Number of items per page
    const offset = currentPage * itemsPerPage;
    const currentStores = stores.slice(offset, offset + itemsPerPage);
    const [clients, setClients] = useState([]);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        // setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/stores`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStores(response.data.stores);
        } catch (error) {
            console.error("Error fetching stores:", error.response ? error.response.data : error.message);
        } finally {
            //   setLoading(false);
        }
    };
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleView = (client) => {
        // Handle view action
        console.log('View client:', client);
    };

    const handleEdit = (client) => {
        // Handle edit action
        console.log('Edit client:', client);
    };

    const handleDelete = (client) => {
        // Handle delete action
        console.log('Delete client:', client);
    };

    return (
        <div className="p-4">
            <h2>Clients</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Token</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentStores.map((client, index) => (
                        <tr key={index}>
                            <td>{client.name}</td>
                            <td>{client.created_at}</td>
                            <td>{client.acc_token}</td>
                            <td>{client.status}</td>
                            <td>
                                <Button variant="info" onClick={() => handleView(client)}>
                                    View
                                </Button>{' '}
                                <Button variant="warning" onClick={() => handleEdit(client)}>
                                    Edit
                                </Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(client)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={Math.ceil(stores.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
            />
        </div>
    );

};

export default ClientPage;