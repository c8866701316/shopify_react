import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { FaStore, FaMoneyBillWave, FaUsers, FaHistory } from 'react-icons/fa';
import { BiCreditCard, BiWallet } from 'react-icons/bi';
import { FiDollarSign, FiClock } from 'react-icons/fi';
import axios from 'axios';
import {
  Spinner,
  Table,
  Card,
  Badge,
  Button,
  Modal,
  Form,
  Alert,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';

const Payment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [paymenthistory, setPaymentHistory] = useState({ payments: [], current_balance: {} });
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const token = localStorage.getItem('access_token');
  const userId = localStorage.getItem('user_id');
  const username = localStorage.getItem('user_name');
  const [id, setId] = useState(localStorage.getItem('payment_session_id') || null); // Initialize with stored ID

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Verify payment only if id exists and hasn't been verified yet
        if (id && !paymenthistory.payments.some((payment) => payment.id === id)) {
          await verifyPayment(id);
          // Clear stored ID and state after verification
          setId(null);
          localStorage.removeItem('payment_session_id');
        }

        // Fetch updated payment history and deduplicate
        const historyResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/payment-history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Deduplicate payments based on id
        const uniquePayments = Array.from(
          new Map(
            historyResponse.data.payments.map((payment) => [payment.id, payment])
          ).values()
        );

        setPaymentHistory({
          payments: Array.isArray(uniquePayments) ? uniquePayments : [],
          current_balance: historyResponse.data.current_balance || {},
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setPaymentHistory({ payments: [], current_balance: {} });
        toast.error('Failed to fetch payment history.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token, id]); // Depend on id

  const verifyPayment = async (sessionId) => {
    console.log('Verifying session ID:', sessionId);
    setVerifying(true);
    try {
      const verifyResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/payment-success?session_id=${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (verifyResponse.data.status === 'success') {
        const paymentStatus = verifyResponse.data.payment_status;

        if (paymentStatus === 'paid') {
          toast.success('Payment completed successfully!');
        } else if (paymentStatus === 'unpaid') {
          toast.warning('Payment not completed yet.');
        } else if (paymentStatus === 'failed') {
          toast.error('Payment failed or was canceled.');
        }

        // Do not manually update payments here; let /payment-history handle it
      }
    } catch (verifyError) {
      console.error('Payment verification failed:', verifyError);
      toast.error('Payment verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      if (!amount || isNaN(amount) || amount < 1) {
        throw new Error('Please enter a valid amount (minimum $1.00)');
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/create-checkout-session`,
        {
          client: userId,
          amount: parseFloat(amount),
          redirect_url: window.location.origin + window.location.pathname,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Store the session ID in state and localStorage
      const sessionId = response.data.id;
      setId(sessionId);
      localStorage.setItem('payment_session_id', sessionId);
      console.log('Session ID set:', sessionId);

      if (response.data.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Payment failed');
      console.error('Payment error:', err);
      toast.error('Payment initiation failed.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge bg="success">Paid</Badge>;
      case 'unpaid':
        return <Badge bg="info" text="dark">Unpaid</Badge>;
      case 'pending':
        return <Badge bg="warning" text="dark">Pending</Badge>;
      case 'failed':
        return <Badge bg="danger">Failed</Badge>;
      case 'canceled':
        return <Badge bg="danger">Canceled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const handlePageClick = ({ selected }) => setCurrentPage(selected);
  const offset = currentPage * itemsPerPage;
  const paginatedPayments = paymenthistory.payments.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(paymenthistory.payments.length / itemsPerPage);

  return (
    <div className="p-4">
      {verifying && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <h5>Verifying your payment...</h5>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <BiWallet className="me-2" />
          Payment Dashboard
        </h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FiDollarSign className="me-2" />
          Make Payment
        </Button>
      </div>

      <Row className="mb-4 g-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="text-muted small mb-1">Balance</Card.Title>
                  <h3 className="mb-0">
                    ${paymenthistory.current_balance.balance_remaining?.toFixed(2) || '0.00'}
                  </h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <BiWallet size={24} className="text-primary" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="text-muted small mb-1">Tokens</Card.Title>
                  <h3 className="mb-0">
                    {paymenthistory.current_balance.tokens_remaining || '0'}
                  </h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <FaStore size={20} className="text-info" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="text-muted small mb-1">Last Updated</Card.Title>
                  <h3 className="mb-0">
                    {paymenthistory.current_balance.last_updated
                      ? new Date(paymenthistory.current_balance.last_updated).toLocaleDateString()
                      : 'N/A'}
                  </h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <FiClock size={20} className="text-warning" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <h5 className="mb-0">
            <FaHistory className="me-2 text-primary" />
            Payment History
          </h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Currency</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPayments.length > 0 ? (
                    paginatedPayments.map((payment, index) => (
                      <tr key={payment.id}>
                        <td>{offset + index + 1}</td>
                        <td>${payment.amount?.toFixed(2)}</td>
                        <td>{new Date(payment.created_at).toLocaleString()}</td>
                        <td>{getStatusBadge(payment.payment_status)}</td>
                        <td>{payment.currency?.toUpperCase() || 'USD'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        No payment history found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {pageCount > 1 && (
                <ReactPaginate
                  previousLabel={'Previous'}
                  nextLabel={'Next'}
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  containerClassName={'pagination justify-content-center mt-4'}
                  activeClassName={'active'}
                />
              )}
            </>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Make Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Client</Form.Label>
              <Form.Control type="text" value={username || 'N/A'} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount (USD)</Form.Label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <Form.Control
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1.00"
                />
              </div>
              <Form.Text>Minimum payment: $1.00</Form.Text>
            </Form.Group>

            {error && <Alert variant="danger">{error}</Alert>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handlePayment}
            disabled={loading || !amount || amount < 1}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Payment;