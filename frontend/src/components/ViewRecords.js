import React, { useState, useEffect } from 'react';

const ViewRecords = ({ contract, account }) => {
  const [patientAddress, setPatientAddress] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewingOwn, setViewingOwn] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (viewingOwn) {
      fetchOwnRecords();
    }
  }, [contract, account, viewingOwn]);

  const fetchOwnRecords = async () => {
    if (!contract || !account) return;
    
    try {
      setLoading(true);
      setErrorMessage('');
      const fetchedRecords = await contract.getRecords(account);
      const parsedRecords = fetchedRecords.map(record => {
        try {
          return JSON.parse(record);
        } catch (e) {
          return { raw: record, error: "Could not parse record" };
        }
      });
      setRecords(parsedRecords);
    } catch (error) {
      console.error("Error fetching own records:", error);
      setErrorMessage("Failed to fetch your records. See console for details.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientRecords = async (e) => {
    e.preventDefault();
    if (!contract || !patientAddress) return;
    
    try {
      setLoading(true);
      setErrorMessage('');
      const fetchedRecords = await contract.getRecords(patientAddress);
      const parsedRecords = fetchedRecords.map(record => {
        try {
          return JSON.parse(record);
        } catch (e) {
          return { raw: record, error: "Could not parse record" };
        }
      });
      setRecords(parsedRecords);
    } catch (error) {
      console.error("Error fetching patient records:", error);
      setErrorMessage("Failed to fetch patient records. You may not have access.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    setViewingOwn(!viewingOwn);
    if (!viewingOwn) {
      setPatientAddress('');
    }
    setRecords([]);
    setErrorMessage('');
  };

  return (
    <div className="view-records">
      <h3>View Health Records</h3>
      
      <div className="view-toggle">
        <button 
          className={viewingOwn ? 'active' : ''} 
          onClick={() => viewingOwn ? null : toggleView()}
        >
          View My Records
        </button>
        <button 
          className={!viewingOwn ? 'active' : ''} 
          onClick={() => !viewingOwn ? null : toggleView()}
        >
          View Patient Records
        </button>
      </div>
      
      {!viewingOwn && (
        <form onSubmit={fetchPatientRecords}>
          <div className="form-group">
            <label>Patient Address:</label>
            <input 
              type="text" 
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              placeholder="0x..."
              required 
            />
            <button type="submit" disabled={loading || !patientAddress}>
              {loading ? 'Loading...' : 'View Records'}
            </button>
          </div>
        </form>
      )}
      
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}
      
      {loading ? (
        <p>Loading records...</p>
      ) : (
        <div className="records-list">
          {records.length === 0 ? (
            <p>No records found.</p>
          ) : (
            <ul>
              {records.map((record, index) => (
                <li key={index} className="record-item">
                  {record.error ? (
                    <div className="record-error">
                      <p>Error: {record.error}</p>
                      <p>Raw data: {record.raw}</p>
                    </div>
                  ) : (
                    <div className="record-details">
                      <h4>{record.filename}</h4>
                      <p><strong>Description:</strong> {record.description}</p>
                      <p><strong>Date Added:</strong> {new Date(record.dateAdded).toLocaleString()}</p>
                      <p><strong>Type:</strong> {record.type}</p>
                      <p><strong>Size:</strong> {record.size} bytes</p>
                      <p><strong>IPFS Hash:</strong> {record.hash}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewRecords; 