import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContract, getAddress } from './contract';
import UploadForm from './components/UploadForm';
import AccessControl from './components/AccessControl';
import ViewRecords from './components/ViewRecords';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upload');
  const [error, setError] = useState('');
  const [networkInfo, setNetworkInfo] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        console.log("Initializing app...");
        setError('');
        
        // Check if MetaMask is installed
        if (!window.ethereum) {
          setError("MetaMask is not installed. Please install MetaMask to use this application.");
          setLoading(false);
          return;
        }
        
        // Get network info
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        setNetworkInfo(network);
        
        console.log("Network info:", network);
        
        // Check if connected to localhost/hardhat network
        if (network.chainId !== 1337 && network.chainId !== 31337) {
          setError(`You are connected to network ${network.name} (${network.chainId}). Please connect to Hardhat Local network (ChainID: 1337 or 31337).`);
          setLoading(false);
          return;
        }
        
        // Try to get the contract and account
        const contractData = await getContract();
        if (contractData && contractData.contract) {
          setContract(contractData.contract);
          
          // Try to get address - may return null if there's a pending request
          const addr = await getAddress();
          if (addr) {
            setAccount(addr);
            console.log("App initialized with account:", addr);
          } else if (retryCount < 3) {
            // If we don't have an address yet, we'll retry a few times
            console.log(`No address yet, will retry (${retryCount + 1}/3)...`);
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 1000); // Retry after 1 second
            return;
          } else {
            setError("Could not get your account. Please connect manually using the button below.");
          }
        } else {
          setError("Failed to connect to smart contract. Please check console for details.");
        }
      } catch (error) {
        console.error("Error initializing app:", error);
        
        // Special handling for the pending request error
        if (error.message && error.message.includes("already pending")) {
          setError("MetaMask has a pending connection request. Please open MetaMask and approve or reject it.");
        } else {
          setError(`Error initializing app: ${error.message || error}`);
        }
      } finally {
        setLoading(false);
      }
    };

    init();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        console.log("Account changed to:", accounts[0]);
        setAccount(accounts[0]);
      });
      
      window.ethereum.on('chainChanged', (chainId) => {
        console.log("Network changed to:", chainId);
        window.location.reload();
      });
    }
    
    return () => {
      // Cleanup listeners
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, [retryCount]); // Add retryCount as a dependency so we can retry initialization

  const connectWallet = async () => {
    try {
      setError('');
      console.log("Connecting wallet...");
      
      // Try to get MetaMask to connect - this will show the popup
      const addr = await getAddress();
      if (addr) {
        setAccount(addr);
        
        // Get the contract again in case it wasn't set earlier
        const contractData = await getContract();
        if (contractData && contractData.contract) {
          setContract(contractData.contract);
          console.log("Wallet connected successfully");
        } else {
          setError("Failed to initialize contract after connecting wallet");
        }
      } else {
        setError("MetaMask connection was not completed. Please try again or check if MetaMask is locked.");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      
      // Special handling for the pending request error
      if (error.message && error.message.includes("already pending")) {
        setError("MetaMask has a pending connection request. Please open MetaMask and approve or reject it.");
      } else {
        setError(`Error connecting wallet: ${error.message || error}`);
      }
    }
  };

  // If we're retrying, show a different loading message
  if (loading && retryCount > 0) {
    return <div className="container">Retrying connection... ({retryCount}/3)</div>;
  } else if (loading) {
    return <div className="container">Loading application...</div>;
  }

  return (
    <div className="container">
      <h1>HealthChain</h1>
      <h2>Secure Medical Records on Blockchain</h2>
      
      {/* Show any errors */}
      {error && (
        <div className="error-banner" style={{
          background: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <p><strong>Error:</strong> {error}</p>
          {error.includes("already pending") && (
            <p>
              <strong>How to fix:</strong> Open MetaMask, look for a pending connection request, 
              and either approve or reject it. Then refresh this page.
            </p>
          )}
        </div>
      )}
      
      {/* Show network info */}
      {networkInfo && (
        <div className="network-info" style={{
          background: '#e3f2fd', 
          padding: '5px 10px', 
          borderRadius: '4px',
          marginBottom: '10px',
          fontSize: '0.9em'
        }}>
          <p>Network: {networkInfo.name || 'Local'} (Chain ID: {networkInfo.chainId})</p>
        </div>
      )}
      
      {!account ? (
        <div className="connect-wallet">
          <p>Please connect your wallet to continue</p>
          <button onClick={connectWallet}>Connect MetaMask</button>
        </div>
      ) : (
        <>
          <div className="account-info">
            <p>Connected Account: {account}</p>
          </div>
          
          <div className="tabs">
            <button 
              className={activeTab === 'upload' ? 'active' : ''} 
              onClick={() => setActiveTab('upload')}
            >
              Upload Record
            </button>
            <button 
              className={activeTab === 'access' ? 'active' : ''} 
              onClick={() => setActiveTab('access')}
            >
              Manage Access
            </button>
            <button 
              className={activeTab === 'view' ? 'active' : ''} 
              onClick={() => setActiveTab('view')}
            >
              View Records
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'upload' && <UploadForm contract={contract} account={account} />}
            {activeTab === 'access' && <AccessControl contract={contract} account={account} />}
            {activeTab === 'view' && <ViewRecords contract={contract} account={account} />}
          </div>
        </>
      )}
    </div>
  );
}

export default App;