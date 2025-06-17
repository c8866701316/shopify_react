import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import { FaStore, FaMoneyBillWave, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import { BiCreditCard } from 'react-icons/bi';


const Payment = () => {
  const [storeOptions, setStoreOptions] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('access_token');
  const [error, setError] = useState('');

  // Fetch stores on component mount
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/store/names`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setStoreOptions(response.data.stores);
      } catch (err) {
        console.error('Error fetching stores:', err);
      }
    };

    // fetchStores();
  }, [token]);

  const calculateTotal = () => {
    return selectedStores.reduce((total, store) => {
      const storeData = storeOptions.find(opt => opt.value === store.value);
      return total + (storeData?.price || 0);
    }, 0);
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Validate inputs
      if (!selectedStores) {
        throw new Error('Please select at least one store');
      }

      if (!amount || isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      // Call backend to create checkout session
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/create-checkout-session`,  // Updated endpoint
        {
          client: selectedStores,
          amount: parseFloat(amount),
          redirect_url:window.location.href
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.open(response.data.url, "_blank")
      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-4 ">
      <div className="card shadow-sm">
        <div className="text-center py-5 mb-3" style={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle"
            style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.2)' }}>
            <BiCreditCard size={28} />
          </div>
          <h3 className="card-title mb-3">Make Payment</h3>
          <p className="mb-0 opacity-75">Select stores and enter payment amount</p>
        </div>

        <div className="card-body">
          {/* Store Selection */}
          <div className="mb-6">
            <label className="form-label fw-semibold">
              <FaUsers className="me-2 text-muted" />
              Clients
            </label>
            <input
              type='text'
              value={selectedStores}
              onChange={(e) => setSelectedStores(e.target.value)}
              placeholder="Enter Clients..."
              className="form-control"
            />
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              <FaMoneyBillWave className="me-2 text-muted" />
              Amount (USD)
            </label>
            <input
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              step="0.01"
            />
            {/* {selectedStores.length > 0 && (
              <div className="mt-2 text-muted">
                Total for selected stores: ${calculateTotal().toFixed(2)}
              </div>
            )} */}
          </div>

          {/* Error Message - Simple display without animation */}
          {error && (
            <div className="alert alert-danger mb-4">
              {error}
            </div>
          )}

          {/* Pay Now Button */}
          <div className="d-grid mt-4">
            <button
              onClick={handlePayment}
              disabled={loading || selectedStores.length === 0 || !amount}
              className="btn btn-primary btn-lg"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                'Pay Now'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
