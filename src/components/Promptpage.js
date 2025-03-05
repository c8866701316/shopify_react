import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Form, Modal, Spinner, Table } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { CiMenuKebab } from "react-icons/ci";
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';

function PromptPage({ role }) {
  if (role === 'client') {
    window.history.back();
  }

  const token = localStorage.getItem('access_token');
  const [prompts, setPrompts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPrompt, setNewPrompt] = useState({ category: '', prompt: '' });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [selectedPromptId, setSelectedPromptId] = useState(null);
  const [storeData, setStoreData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const promptsPerPage = 10;

  useEffect(() => {
    fetchPrompts();
    fetchStoreData();
  }, []);

  const fetchPrompts = async () => {

    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/addprompt`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.prompts) {
        setPrompts(response.data.prompts);
      } else {
        toast.error('Invalid data format received.');
      }
    } catch (error) {
      console.error('Error fetching prompts:', error);
      toast.error('Failed to fetch prompts.');
    } finally {
      setLoading(false);
    }
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

  const handleAddPrompt = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/addprompt`,
        newPrompt,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Prompt added successfully!');
      setShowModal(false);
      setNewPrompt({ category: '', prompt: '' });
      fetchPrompts();
    } catch (error) {
      console.error('Error adding prompt:', error);
      toast.error('Failed to add prompt.');
    }
  };

  const handleChange = (e) => {
    setNewPrompt({ ...newPrompt, [e.target.name]: e.target.value });
  };

  const handleStoreSelection = async (store, prompt_id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        html: `You are about to assign this prompt to store <b>${store.name}</b> and Client <b>${store.client_name}</b>.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, assign it!',
      });

      if (result.isConfirmed) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/admin/promptmapping`,
          { store_id: store.id, prompt_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message,
        });
        fetchStoreData();
      }
    } catch (error) {
      console.error('Error assigning prompt to store:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An unexpected error occurred.',
      });
    }
  };

  const filteredStores = storeData.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredStoresForPrompt = storeData.filter(
    (store) =>
      store.name.toLowerCase().includes(filter.toLowerCase()) ||
      store.client_name.toLowerCase().includes(filter.toLowerCase())
  );

  const filteredPrompts = prompts.filter((prompt) => {
    if (!filter) return true;
     // If no filter is applied, show all prompts
    const matchedStores = storeData.filter(
      (store) =>
        (store.name.toLowerCase().includes(filter.toLowerCase()) ||
          store.client_name.toLowerCase().includes(filter.toLowerCase())) &&
        store.prompt_id === prompt.id
    );

    return matchedStores.length > 0; // Only show prompts that have matched stores
  });
  // Pagination logic
  const pageCount = Math.ceil(filteredPrompts.length / promptsPerPage);
  const offset = currentPage * promptsPerPage;
  const paginatedPrompts = filteredPrompts.slice(offset, offset + promptsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  return (
    <div className="p-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Prompts</h2>
        <div className="d-flex gap-2">
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
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search store or client..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  marginBottom: "10px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />

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
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add Prompt +
          </Button>
        </div>
      </div>
      {
        loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) :
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category</th>
                  <th>Prompt</th>
                  <th>Created At</th>
                  <th>Mapping Store</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPrompts.length > 0 ? (
                  paginatedPrompts.map((prompt, index) => {
                    const isSelected = selectedPromptId === prompt.id;

                    // Filter stores that match the current prompt
                    const matchedStores = storeData
                      .filter(store => store.prompt_id === prompt.id)
                      .map(store => store.name); // Extract store names

                    return (
                      <tr
                        key={prompt.id}
                        className={isSelected ? 'table-secondary' : 'table-white'}
                        style={{ opacity: isSelected || selectedPromptId === null ? 1 : 0.5 }}
                      >
                        <td>{index + 1}</td>
                        <td>{prompt.category}</td>
                        <td>
                          <textarea
                            readOnly
                            rows={1}
                            value={prompt.prompt}
                            style={{ width: '100%', border: 'none', backgroundColor: 'transparent' }}
                          />
                        </td>
                        <td>{new Date(prompt.created_at).toLocaleString()}</td>
                        <td>{matchedStores.length > 0 ? matchedStores.join(", ") : "No Store Assigned"}</td>
                        <td>
                          <div className="d-flex gap-5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => setSelectedPromptId(isSelected ? null : prompt.id)}
                            />
                            {isSelected && (
                              <Dropdown>
                                <Dropdown.Toggle variant="link" id="dropdown-menu" className="p-0">
                                  <CiMenuKebab />
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
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="🔍 Search store or client..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                      marginBottom: "10px",
                                      padding: "8px",
                                      borderRadius: "6px",
                                      border: "1px solid #ccc",
                                      fontSize: "14px",
                                    }}
                                  />
                                  {filteredStores.length > 0 ? (
                                    filteredStores.map((store) => (
                                      <Dropdown.Item
                                        key={store.id}
                                        onClick={() => handleStoreSelection(store, prompt.id)}
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
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No prompts available</td>
                  </tr>
                )}
              </tbody>
            </Table>
            <ReactPaginate
              previousLabel={'← Previous'}
              nextLabel={'Next →'}
              pageCount={pageCount}
              onPageChange={handlePageChange}
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
            />
          </>
      }
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Prompt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddPrompt}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" name="category" value={newPrompt.category} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Prompt</Form.Label>
              <Form.Control as="textarea" rows={3} name="prompt" value={newPrompt.prompt} onChange={handleChange} required />
            </Form.Group>
            <Button variant="primary" type="submit">Add Prompt</Button>
          </Form>
        </Modal.Body>
      </Modal>


    </div>
  );
}

export default PromptPage;