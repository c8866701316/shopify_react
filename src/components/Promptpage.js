import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form, Modal, Table, ToastContainer } from 'react-bootstrap';
import { toast } from 'react-toastify';

function Promptpage({ role }) {
  if (role === 'client') {
    window.history.back()
  }
  const token = localStorage.getItem('access_token');
  const [addprompt, setAddprompt] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [newPrompt, setNewPrompt] = useState({ category: '', prompt: '' });

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/addprompt`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if the response contains the `prompts` array
      if (response.data && Array.isArray(response.data.prompts)) {
        setAddprompt(response.data.prompts); // Set the prompts data
        // toast.success("Prompts retrieved successfully!"); // Show success toast
      } else {
        toast.error("Invalid data format received from the API.");
      }
    } catch (error) {
      console.error("Error fetching prompts:", error.response ? error.response.data : error.message);
      toast.error("Failed to fetch prompts."); // Show error toast
    }
  };

  const handleAddPrompt = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/addprompt`,
        newPrompt,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        toast.success("Prompt added successfully!"); // Show success toast
        setShowModal(false); // Close the modal
        setNewPrompt({ category: '', prompt: '' }); // Reset the form
        fetchPrompts(); // Refresh the prompts list
      }
    } catch (error) {
      console.error("Error adding prompt:", error.response ? error.response.data : error.message);
      toast.error("Failed to add prompt."); // Show error toast
    }
  };

  const handleChange = (e) => {
    setNewPrompt({ ...newPrompt, [e.target.name]: e.target.value }); // Update form state
  };
  return (
    <div className="p-4">
      <ToastContainer /> {/* Toast container for displaying messages */}

      <div className="d-flex justify-content-between gap-2">
      <h2>Prompts</h2>
        <Button variant="primary" style={{marginBottom:'5px'}} onClick={() => setShowModal(true)}>
          Prompt Add +
        </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Category</th>
            <th>Prompt</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {addprompt.length > 0 ? (
            addprompt.map((prompt, index) => (
              <tr key={prompt.id}>
                <td>{index + 1}</td>
                <td>{prompt.category}</td>
                <td>{prompt.prompt}</td>
                <td>{new Date(prompt.created_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                <p>No prompts available</p>
              </td>
            </tr>
          )}
        </tbody>
      </Table>

       {/* Add Prompt Modal */}
       <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Prompt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddPrompt}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={newPrompt.category}
                onChange={handleChange}
                placeholder="Enter category"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Prompt</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="prompt"
                value={newPrompt.prompt}
                onChange={handleChange}
                placeholder="Enter prompt"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Prompt
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Promptpage