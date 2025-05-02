import React, { useState } from 'react';

function UploadForm({ contract }) {
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToIPFS = async () => {
    // In a real application, you would upload to IPFS here
    // For this demo, we'll simulate by creating a fake hash based on the file name
    if (!file) return '';
    
    // This is just a mock function - in a real app you'd use a service like Pinata or IPFS client
    const mockHash = `ipfs-${Date.now()}-${file.name.replace(/\s/g, '')}`;
    return mockHash;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file first');
      return;
    }

    try {
      setLoading(true);
      setMessage('Processing...');
      
      // Upload to IPFS (mock)
      const hash = await uploadToIPFS();
      setIpfsHash(hash);
      
      // Add record to blockchain
      const tx = await contract.addRecord(hash);
      await tx.wait();
      
      setMessage('Record added successfully!');
      setFile(null);
      
      // Reset the form
      e.target.reset();
    } catch (error) {
      console.error("Error adding record:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-form">
      <h3>Upload Medical Record</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Medical Record File:</label>
          <input 
            type="file" 
            onChange={handleFileChange} 
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading || !file}>
          {loading ? 'Uploading...' : 'Upload Record'}
        </button>
      </form>
      
      {message && <div className="message">{message}</div>}
      
      {ipfsHash && (
        <div className="ipfs-result">
          <p>IPFS Hash: {ipfsHash}</p>
          <p className="note">This is a simulated hash. In a real application, this would be a valid IPFS hash.</p>
        </div>
      )}
    </div>
  );
}

export default UploadForm;