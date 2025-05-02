import React, { useState } from 'react';

const UploadForm = ({ contract, account }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [hash, setHash] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !description) return;

    try {
      // Check if contract is available
      if (!contract) {
        setErrorDetails("Contract is not available. Check your wallet connection.");
        console.error("Contract is null or undefined");
        return;
      }

      // Verify connected account
      console.log("Connected account:", account);
      
      setUploading(true);
      setErrorDetails('');
      
      // Simulate IPFS upload by generating a random hash
      // In a real app, you would upload to IPFS here
      const mockHash = `ipfs-${Math.random().toString(36).substring(2, 15)}`;
      setHash(mockHash);

      // Create a simple JSON record - keep it small to avoid gas issues
      const record = JSON.stringify({
        desc: description.substring(0, 100), // Limit description size
        file: file.name.substring(0, 30),
        hash: mockHash
      });

      console.log("Sending transaction to contract...");
      console.log("Contract address:", contract.address);
      console.log("Record length:", record.length, "bytes");
      console.log("Using account:", account);
      
      // Add record to blockchain with gas price options
      const gasLimit = 500000; // Increase gas limit
      const tx = await contract.addRecord(record, { 
        gasLimit: gasLimit
      });
      
      console.log("Transaction sent:", tx.hash);
      
      // Wait for transaction confirmation
      console.log("Waiting for confirmation...");
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      
      setUploadSuccess(true);
      setDescription('');
      setFile(null);
    } catch (error) {
      console.error("Error uploading record:", error);
      let errorMsg = "Failed to upload record: ";
      
      if (error.code === 4001) {
        errorMsg += "Transaction was rejected in MetaMask.";
      } else if (error.code === -32603) {
        errorMsg += "Internal JSON-RPC error. You might not have enough ETH or there's a connection issue.";
      } else if (error.message && error.message.includes("cannot estimate gas")) {
        errorMsg += "Cannot estimate gas. The contract might have reverted the transaction.";
      } else if (error.message && error.message.includes("invalid block tag")) {
        errorMsg += "Network synchronization issue. Please refresh the page.";
      } else if (error.message) {
        errorMsg += error.message;
      }
      
      setErrorDetails(errorMsg);
      alert("Failed to upload record. See console and form for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-form">
      <h3>Upload Medical Record</h3>
      
      {uploadSuccess ? (
        <div className="success-message">
          <p>Record successfully uploaded to the blockchain!</p>
          <p>IPFS Hash: {hash}</p>
          <button onClick={() => setUploadSuccess(false)}>Upload Another</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>File:</label>
            <input 
              type="file" 
              onChange={handleFileChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter record description"
              required
            />
          </div>
          
          <button type="submit" disabled={uploading || !file || !description}>
            {uploading ? 'Uploading...' : 'Upload Record'}
          </button>
          
          {errorDetails && (
            <div className="error-message" style={{color: 'red', marginTop: '10px', padding: '10px', border: '1px solid red', borderRadius: '4px'}}>
              <p>{errorDetails}</p>
              <p>Make sure you're connected to the Hardhat network and have imported a test account!</p>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default UploadForm; 