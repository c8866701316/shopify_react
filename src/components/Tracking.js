import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Modal, Spinner } from 'react-bootstrap';
import Moment from 'react-moment';
import ReactPaginate from 'react-paginate';

const Tracking = ({role}) => {
    if (role === 'client') {
        window.history.back();
      }
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const token = localStorage.getItem('access_token');
    const [modalContent, setModalContent] = useState({
        title: '',
        body: '',
        loading: false
    });
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        function formatLocalDateTime(date) {
            const pad = (n) => n.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
        }

        const now = new Date();

        const todayStart = formatLocalDateTime(new Date(now.setHours(0, 0, 0, 0)));
        const todayEnd = formatLocalDateTime(new Date(now.setHours(23, 59, 59, 999)));


        setFromDate(todayStart);
        setToDate(todayEnd);
    }, []);

    const pageCount = Math.ceil(data.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentItems = data.slice(offset, offset + itemsPerPage);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const formatDateTimeForAPI = (dateTimeString) => {
        if (!dateTimeString) return '';

        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const twelveHour = hours % 12 || 12;

        return `${year}-${month}-${day} ${twelveHour}:${minutes} ${ampm}`;
    };

    const fetchTrackingData = async () => {
        if (!fromDate || !toDate) return;

        setLoading(true);
        setError(null);

        try {
            const start_date = formatDateTimeForAPI(fromDate);
            const end_date = formatDateTimeForAPI(toDate);

            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/admin/trainings-by-date`,
                {
                    params: { start_date, end_date },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setData(prevData => {
                const newData = response.data?.data?.trainings || [];
                return JSON.stringify(prevData) === JSON.stringify(newData)
                    ? prevData
                    : newData;
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch tracking data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let intervalId;

        const startPolling = () => {
            fetchTrackingData();
            intervalId = setInterval(fetchTrackingData, 20000);
        };

        if (fromDate && toDate) {
            startPolling();
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [fromDate, toDate]);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (name === 'fromDate') {
            setFromDate(value);
        } else {
            setToDate(value);
        }
    };

    const openFileInNewTab = async (filename) => {
        try {
            setModalContent({
                title: `File: ${filename}`,
                body: 'Opening file...',
                loading: true
            });
            setShowModal(true);

            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/admin/get-training-file/${filename}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                }
            );

            const blob = new Blob([response.data], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);

            const newWindow = window.open(url, '_blank');
            setShowModal(false);

            if (!newWindow || newWindow.closed) {
                // Fallback to download
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }

            setTimeout(() => window.URL.revokeObjectURL(url), 100);

        } catch (error) {
            console.error('Error fetching file:', error);
            setModalContent({
                title: 'Error',
                body: 'Failed to open file. Please try again.',
                loading: false
            });
        }
    };

    const showPrompt = (promptText, storeName) => {
        if (!promptText) {
            setModalContent({
                title: `Prompt for ${storeName}`,
                body: '<div class="text-muted">No prompt text available</div>',
                loading: false
            });
            setShowModal(true);
            return;
        }

        let cleanedPrompt = promptText;

        cleanedPrompt = cleanedPrompt.replace(/\\"/g, '"');
        cleanedPrompt = cleanedPrompt.replace(/\\n/g, '\n');

        const formattedPrompt = cleanedPrompt
            .split('\n')
            .map(line => `<div>${line}</div>`)
            .join('');

        setModalContent({
            title: `Prompt for ${storeName}`,
            body: `
                <div style="
                    white-space: pre-wrap;
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                    font-family: monospace;
                    max-height: 60vh;
                    overflow: auto;
                ">
                    ${formattedPrompt}
                </div>
            `,
            loading: false
        });
        setShowModal(true);
    };
    return (
        <div className='d-flex flex-column p-3'>
            <div className='d-flex py-2 flex-wrap justify-content-sm-between justify-content-center align-items-center'>
                <h1>Tracking</h1>
                <div className="d-flex flex-wrap align-items-end gap-1 gap-sm-3 justify-content-center">
                    <div className="d-flex align-items-center gap-2">
                        <label htmlFor="fromDate" className="form-label small text-muted mb-1">
                            From:
                        </label>
                        <input
                            id="fromDate"
                            name="fromDate"
                            type="datetime-local"
                            className="form-control form-control-sm"
                            value={fromDate}
                            onChange={handleDateChange}
                        />
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <label htmlFor="toDate" className="form-label small text-muted mb-1">
                            To:
                        </label>
                        <input
                            id="toDate"
                            name="toDate"
                            type="datetime-local"
                            className="form-control form-control-sm"
                            value={toDate}
                            onChange={handleDateChange}
                        />
                    </div>
                </div>
            </div>

            {error && <p className="text-danger text-center">{error}</p>}

            <div className="table-responsive" style={{ width: '100%', overflowX: 'auto' }}>
                {/* {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" />
                    </div>
                ) : ( */}
                    <>
                        <Table striped bordered hover responsive className="mb-0">
                            <thead>
                                <tr>
                                    <th>Info</th>
                                    <th>Init</th>
                                    <th>Fetch Product</th>
                                    <th>Jsonl Done</th>
                                    <th>File Upload</th>
                                    <th>Fine Tuning...</th>
                                    <th>Try</th>
                                    <th>Fine Tune Model</th>
                                    <th>Failed</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentItems.length > 0 ? (
                                    currentItems.map((item) => {
                                        const status = item.status || '';
                                        const jsonlStatus = item.jsonl_status || '';

                                        const isInit = status === 'init' && (jsonlStatus === 'init' || jsonlStatus === 'PRODUCT_FETCHING');
                                        const isFetchProduct = jsonlStatus === 'JSON_DONE' || jsonlStatus === 'JSONL_CREATION_RUNNING';
                                        const isJsonlDone = status === 'MODEL_FILE_ID_RUNNING' && jsonlStatus === 'JSONL_CREATION_SUCCESS';
                                        const isFileUpload = status === 'MODEL_FILE_ID_CREATED' && jsonlStatus === 'JSONL_CREATION_SUCCESS';
                                        const isFineTuning = status === 'MODEL_TRAINING_RUNNING' && jsonlStatus === 'JSONL_CREATION_SUCCESS';
                                        const isFineTuneModel = status === 'MODEL_TRAINING_SUCCESS' && jsonlStatus === 'JSONL_CREATION_SUCCESS';
                                        const isFailed = ['MODEL_FILE_ID_FAILED', 'MODEL_TRAINING_FAILED'].includes(status) ||
                                            ['JSON_FETCH_FAILED', 'JSONL_CREATION_FAILED'].includes(jsonlStatus);

                                        const uploadedFilename = item.file_id
                                            ? item.file_id
                                            : null

                                        return (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="d-flex flex-column">
                                                        <strong>{item.store_name || '-'}</strong>
                                                        <small className="text-muted">
                                                            {item.created_at ? (
                                                                <Moment format="YYYY-MM-DD HH:mm A">
                                                                    {item.created_at}
                                                                </Moment>
                                                            ) : '-'}
                                                        </small>
                                                    </div>
                                                </td>

                                                <td>{isInit ? item.id : '-'}</td>
                                                <td
                                                >
                                                    {(uploadedFilename && uploadedFilename.includes("json")) ? (
                                                        <div className={uploadedFilename && uploadedFilename.includes("json") ? 'cursor-pointer text-primary hover-underline' : ''}
                                                            onClick={() => (uploadedFilename && uploadedFilename.includes("json")) && openFileInNewTab(uploadedFilename)}>
                                                            {`${item.id}_trainin.json view`} <i className="bi bi-file-earmark-text ms-1"></i>
                                                        </div>
                                                    ) : uploadedFilename ?
                                                        <div className="d-flex flex-column">
                                                            <strong>{item.id}</strong>
                                                            <small>
                                                                {uploadedFilename}
                                                            </small>
                                                        </div>
                                                        : '-'}
                                                </td>
                                                <td

                                                >
                                                    {item.prompt_text ? (
                                                        <div className={item.prompt_text ? 'cursor-pointer text-primary hover-underline' : ''}
                                                            onClick={() => item.prompt_text && showPrompt(item.prompt_text, item.store_name)}>
                                                            {`${item.id}_prompt View`}  <i className="bi bi-chat-left-text ms-1"></i>
                                                        </div>
                                                    ) : '-'}
                                                </td>
                                                <td>
                                                    {item.file_jsonl ? (
                                                        <div
                                                            className={item.file_jsonl ? 'cursor-pointer text-primary hover-underline' : ''}
                                                            onClick={() => item.file_jsonl && openFileInNewTab(item.file_jsonl)}
                                                        >
                                                            {`${item.id}_trainin_jsonl.json view`} <i className="bi bi-file-earmark-arrow-up ms-1"></i>
                                                        </div>
                                                    ) : '-'}
                                                </td>
                                                <td>{isFineTuning ? item.id : '-'}</td>
                                                <td className="fw-bold">
                                                    {item.try - 1 || '0'}
                                                </td>
                                                <td>
                                                    {isFineTuneModel ? (
                                                        <div className="d-flex flex-column">
                                                            <strong>{item.id}</strong>
                                                            <small className="text-muted">
                                                                {item.model_id && item.model_id}
                                                            </small>
                                                        </div>
                                                    ) : '-'}
                                                </td>
                                                <td className='text-danger'>{isFailed ?
                                                    <div className="d-flex flex-column">
                                                        <strong>{item.id}</strong>
                                                        <small>
                                                            {item.error_message}
                                                        </small>
                                                    </div>
                                                    : '-'}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center">
                                            {loading ? 'Loading...' : 'No data available for selected dates'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        {data.length > itemsPerPage && (
                            <ReactPaginate
                                previousLabel={'Previous'}
                                nextLabel={'Next'}
                                pageCount={pageCount}
                                onPageChange={handlePageChange}
                                containerClassName={'pagination justify-content-center mt-3'}
                                pageClassName={'page-item'}
                                pageLinkClassName={'page-link'}
                                previousClassName={'page-item'}
                                previousLinkClassName={'page-link'}
                                nextClassName={'page-item'}
                                nextLinkClassName={'page-link'}
                                breakClassName={'page-item'}
                                breakLinkClassName={'page-link'}
                                activeClassName={'active'}
                                forcePage={currentPage}
                            />
                        )}
                    </>
                {/* )} */}

            </div>

            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>{modalContent.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflow: 'auto' }}>
                    {modalContent.loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: modalContent.body }} />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                    >
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Tracking;