import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Form, Modal, Table } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { CiMenuKebab } from "react-icons/ci";
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

function PromptPage({ role }) {
  if (role === 'client') {
    window.history.back();
  }

  const token = localStorage.getItem('access_token');
  const [prompts, setPrompts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPrompt, setNewPrompt] = useState({ category: '', prompt: '' });
  const [filter, setFilter] = useState('default');
  const [selectedPromptId, setSelectedPromptId] = useState(null);
  const [dropdownData, setDropdownData] = useState([]);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
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
    }
  };

  const fetchDropdownData = async () => {
    try {
     if(dropdownData.length === 0){
       const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/stores`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.stores) {
        setDropdownData(response.data.stores);
      } else {
        toast.error('Invalid data format received.');
      }}
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

  const handleStoreSelection = async (store_id, prompt_id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `You are about to assign this prompt to store ${store_id}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, assign it!',
      });

      if (result.isConfirmed) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/admin/promptmapping`,
          { store_id, prompt_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
         Swal.fire(response.data.message);
       
      }
    } catch (error) {
      console.error('Error assigning prompt to store:', error);
      Swal.fire('Error', error.response.data.message, 'error');
    }
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Prompts</h2>
        <div className="d-flex gap-2">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="filter-dropdown">
              {filter === 'default' ? 'Default' : 'Store'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setFilter('default')}>Default</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter('store')}>Store</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add Prompt +
          </Button>
        </div>
      </div>
      <Table bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Category</th>
            <th>Prompt</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {prompts.length > 0 ? (
            prompts.map((prompt, index) => (
              <tr key={prompt.id}  className={selectedPromptId === prompt.id ? 'table-active' : 'text-muted'}>
                <td>{index + 1}</td>
                <td>{prompt.category}</td>
                <td>
                  <textarea
                    readOnly
                    rows={1}
                    value={prompt.prompt}
                    style={{ width: '100%', border: 'none', backgroundColor: 'transparent' }}
                    onFocus={(e) => (e.target.style.overflow = 'auto')}
                    onBlur={(e) => (e.target.style.overflow = 'hidden')}
                  />
                </td>
                <td>{new Date(prompt.created_at).toLocaleString()}</td>
                <td>
                  <div className='d-flex gap-5'>
                  <input
                    type="checkbox"
                    checked={selectedPromptId === prompt.id}
                    onChange={() => {
                      setSelectedPromptId((prev) => (prev === prompt.id ? null : prompt.id));
                      if (selectedPromptId !== prompt.id) fetchDropdownData();
                    }}
                  />
                  {selectedPromptId === prompt.id && (
                    <Dropdown>
                      <Dropdown.Toggle variant="link" id="dropdown-menu" className="p-0">
                        <CiMenuKebab />
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        style={{
                          maxHeight: '200px', // Fixed height
                          overflowY: 'auto', // Enable scrolling
                        }}
                      >
                        {dropdownData.length > 0 ? (
                          dropdownData.map((store) => (
                            <Dropdown.Item
                              key={store.id}
                              onClick={() => handleStoreSelection(store.id, prompt.id)}
                            >
                              {store.name}
                            </Dropdown.Item>
                          ))
                        ) : (
                          <Dropdown.Item disabled>No stores available</Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No prompts available</td>
            </tr>
          )}
        </tbody>
      </Table>
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