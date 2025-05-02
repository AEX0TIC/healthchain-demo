import React, { useState, useEffect } from 'react';

function ViewRecords({ contract, account }) {
  const [records, setRecords] = useState([]);
  const [patientAddress, setPatientAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchOwnRecords = async () => {
    try {
      setLoading(true);
      setMessage('Loading your records...');
      
      const recordList = await contract.getRecords(account);
      setRecords(recordList);
      
      if (recordList.length === 0) {
        setMessage('You have no records yet');
      } else {
        setMessage(`Found ${recordList.length} records`);
      }
    } catch (error) {
      console.error("Error fetching records:", error);
      setMessage(`Error: ${error.message}`);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientRecords = async () => {
    if (!patientAddress) {
      setMessage('Please enter a patient address');
      return;
    }

    try {
      setLoading(true);
      setMessage(`Loading records for ${patientAddress}...`);
      
      const recordList = await contract.getRecords(patientAddress);
      setRecords(recordList);
      
      if (recordList.length === 0) {
        setMessage('No records found for this patient');
      } else {
        setMessage(`Found ${recordList.length} records for ${patientAddress}`);
      }
    } catch (error) {
      console.error("Error fetching patient records:", error);
      if (error.message.includes("Not authorized")) {
        setMessage(`You don't have access to this patient's records`);
      } else {
        setMessage(`Error: ${error.message}`);
      }
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchOwnRecords();
    }
  }, [contract, account]);

  return (
    <div className="view-records">
      <h3>View Medical Records</h3>
      
      <div className="records-tabs">
        <button onClick={fetchOwnRecords}>My Records</button>
        <div className="patient-search">
          <input
            type="text"
            placeholder="Patient's Ethereum Address"
            value={patientAddress}
            onChange={(e) => setPatientAddress(e.target.value)}
            disabled={loading}
          />
          <button onClick={fetchPatientRecords} disabled={loading || !patientAddress}>
            View Patient Records
          </button>
        </div>
      </div>
      
      {message && <div className="message">{message}</div>}
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="records-list">
          {records.length > 0 ? (
            <ul>
              {records.map((hash, index) => (
                <li key={index}>
                  <div className="record-item">
                    <span className="record-hash">{hash}</span>
                    <a 
                      href={`https://ipfs.io/ipfs/${hash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="view-button"
                    >
                      View
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No records to display</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ViewRecords;