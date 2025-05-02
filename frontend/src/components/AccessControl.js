import React, { useState } from 'react';

const AccessControl = ({ contract, account }) => {
  const [doctorAddress, setDoctorAddress] = useState('');
  const [isGranting, setIsGranting] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorAddress) return;
    
    try {
      setProcessing(true);
      setSuccessMessage('');
      setErrorMessage('');
      
      if (isGranting) {
        await contract.grantAccess(doctorAddress);
        setSuccessMessage(`Access granted to ${doctorAddress}`);
      } else {
        await contract.revokeAccess(doctorAddress);
        setSuccessMessage(`Access revoked from ${doctorAddress}`);
      }
      
      setDoctorAddress('');
    } catch (error) {
      console.error("Error managing access:", error);
      setErrorMessage(`Failed to ${isGranting ? 'grant' : 'revoke'} access. See console for details.`);
    } finally {
      setProcessing(false);
    }
  };

  const checkAccess = async () => {
    if (!doctorAddress) return;
    
    try {
      setProcessing(true);
      setSuccessMessage('');
      setErrorMessage('');
      
      const hasAccess = await contract.hasAccess(account, doctorAddress);
      setSuccessMessage(`Doctor ${doctorAddress} ${hasAccess ? 'has' : 'does not have'} access to your records.`);
    } catch (error) {
      console.error("Error checking access:", error);
      setErrorMessage("Failed to check access status. See console for details.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="access-control">
      <h3>Manage Access to Your Records</h3>
      
      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Doctor's Ethereum Address:</label>
          <input 
            type="text" 
            value={doctorAddress}
            onChange={(e) => setDoctorAddress(e.target.value)}
            placeholder="0x..."
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Action:</label>
          <div className="radio-group">
            <label>
              <input 
                type="radio" 
                checked={isGranting} 
                onChange={() => setIsGranting(true)} 
              />
              Grant Access
            </label>
            <label>
              <input 
                type="radio" 
                checked={!isGranting} 
                onChange={() => setIsGranting(false)} 
              />
              Revoke Access
            </label>
          </div>
        </div>
        
        <div className="button-group">
          <button type="submit" disabled={processing || !doctorAddress}>
            {processing ? 'Processing...' : isGranting ? 'Grant Access' : 'Revoke Access'}
          </button>
          <button type="button" onClick={checkAccess} disabled={processing || !doctorAddress}>
            Check Access
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccessControl; 