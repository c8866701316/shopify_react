import React, { useState } from 'react';
import { Table } from 'react-bootstrap';

function KeyConfiguration({ role }) {
  const [keys, setKeys] = useState([
    { id: 1, key: 'Key1', model: 'Model1', company: 'Company1', email: 'email1@example.com', notes: 'Notes1', enabled: true, weight: 30 },
    { id: 2, key: 'Key2', model: 'Model2', company: 'Company2', email: 'email2@example.com', notes: 'Notes2', enabled: true, weight: 30 },
    { id: 3, key: 'Key3', model: 'Model3', company: 'Company3', email: 'email3@example.com', notes: 'Notes3', enabled: true, weight: 40 },
    { id: 4, key: 'Key4', model: 'Model4', company: 'Company4', email: 'email4@example.com', notes: 'Notes4', enabled: false, weight: 0 },
  ]);

  // Redirect if role is 'client'
  if (role === 'client') {
    window.history.back();
    return null;
  }

  // Handle weight change
  const handleWeightChange = (id, value) => {
    const updatedKeys = keys.map((key) =>
      key.id === id ? { ...key, weight: parseInt(value, 10) } : key
    );
    setKeys(updatedKeys);
  };

  // Handle enable/disable toggle
  const handleToggleEnable = (id) => {
    const updatedKeys = keys.map((key) =>
      key.id === id ? { ...key, enabled: !key.enabled, weight: key.enabled ? 0 : 30 } : key
    );
    setKeys(updatedKeys);
  };

  // Calculate total weight of enabled keys
  const totalWeight = keys.reduce((sum, key) => (key.enabled ? sum + key.weight : sum), 0);

  return (
    <div className='"d-flex flex-column align-items-center p-3'>
      <h1>Key Configuration</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Key</th>
            <th>Model</th>
            <th>Company</th>
            <th>Linked Email</th>
            <th>Notes</th>
            <th>Enabled</th>
            <th>Weight (%)</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <tr key={key.id}>
              <td>{key.key}</td>
              <td>{key.model}</td>
              <td>{key.company}</td>
              <td>{key.email}</td>
              <td>{key.notes}</td>
              <td>
                <input
                  type="checkbox"
                  checked={key.enabled}
                  onChange={() => handleToggleEnable(key.id)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={key.weight}
                  onChange={(e) => handleWeightChange(key.id, e.target.value)}
                  min="0"
                  max="100"
                  disabled={!key.enabled}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div>
        <strong>Total Weight: {totalWeight}%</strong>
        {totalWeight !== 100 && (
          <p style={{ color: 'red' }}>Total weight must be 100%</p>
        )}
      </div>
    </div>
  );
}

export default KeyConfiguration;