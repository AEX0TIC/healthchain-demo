import { ethers } from "ethers";
import HealthRecords from "./artifacts/contracts/HealthRecords.sol/HealthRecords.json";

// This address will need to be updated after deployment
const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

console.log("Using contract address:", contractAddress);

// Track if we have a pending request
let pendingRequest = false;

export const getContract = async () => {
  if (!window.ethereum) {
    console.warn("No Ethereum provider (MetaMask) detected");
    return null;
  }
  
  try {
    console.log("Creating provider without requesting accounts...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Get network information without requesting accounts
    const network = await provider.getNetwork();
    console.log("Connected to network:", network);
    
    // Only request accounts if we don't have a pending request
    if (!pendingRequest) {
      try {
        pendingRequest = true;
        console.log("Requesting accounts...");
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.error("Error requesting accounts:", error);
        // If the error is about pending requests, let's just use the current signer
        if (!error.message.includes("already pending")) {
          throw error;
        }
      } finally {
        pendingRequest = false;
      }
    } else {
      console.log("Skipping account request because one is already pending");
    }
    
    console.log("Getting signer...");
    const signer = provider.getSigner();
    
    // Try to get the address - if this fails the user might not be connected
    try {
      const address = await signer.getAddress();
      console.log("Using signer with address:", address);
    } catch (error) {
      console.warn("Could not get signer address, user might not be connected");
    }
    
    console.log("Creating contract instance...");
    const contract = new ethers.Contract(contractAddress, HealthRecords.abi, signer);
    console.log("Contract created successfully");
    
    return { contract, signer };
  } catch (error) {
    console.error("Error in getContract:", error);
    throw error;
  }
};

export const getAddress = async () => {
  if (!window.ethereum) {
    console.warn("No Ethereum provider (MetaMask) detected");
    return null;
  }
  
  try {
    // Use cached accounts if available to avoid multiple requests
    const accounts = await window.ethereum.request({ 
      method: "eth_accounts" // This doesn't trigger the MetaMask popup
    });
    
    if (accounts && accounts.length > 0) {
      console.log("Using cached accounts:", accounts);
      return accounts[0];
    }
    
    // Only request if we don't have a pending request
    if (!pendingRequest) {
      try {
        pendingRequest = true;
        console.log("Getting Ethereum accounts...");
        const requestedAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("Available accounts:", requestedAccounts);
        return requestedAccounts[0];
      } finally {
        pendingRequest = false;
      }
    } else {
      console.log("Skipping account request because one is already pending");
      return null;
    }
  } catch (error) {
    console.error("Error in getAddress:", error);
    // If the error is about pending requests, return null instead of throwing
    if (error.message.includes("already pending")) {
      return null;
    }
    throw error;
  }
};