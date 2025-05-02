# HealthChain Demo

A blockchain-based health records management system that allows patients to securely store and share their medical records.

## Quick Start (PowerShell)

1. Right-click on `start-powershell.ps1` and select "Run with PowerShell"
2. This will automatically:
   - Kill any existing node processes
   - Start the blockchain in a new window
   - Deploy the contract and start the frontend
   
3. To stop all processes when done:
   - Right-click on `stop-powershell.ps1` and select "Run with PowerShell"

## Manual Setup

### 1. Setup:
- Clone the repository
- Install root dependencies:
  ```
  npm install
  ```
- Install frontend dependencies:
  ```
  cd frontend
  npm install
  cd ..
  ```

### 2. Development:
- Run a local Ethereum node:
  ```
  npm run blockchain
  ```
- In a new terminal, deploy the contract:
  ```
  npm run deploy
  ```
- Start the React frontend:
  ```
  cd frontend
  npm start
  ```

### 3. Testing:
- Connect with MetaMask (make sure to connect to localhost:8545)
- Import a test account using the private key provided by Hardhat node
- Upload records, grant access to other addresses, and test viewing records

## Troubleshooting

If you encounter "address already in use" errors:
- Run `Stop-Process -Name "node" -Force` in PowerShell
- Or use the provided `stop-powershell.ps1` script

## Project Structure
- `/contracts` - Smart contracts
- `/scripts` - Deployment and test scripts
- `/frontend` - React frontend application

## Technologies Used
- Solidity for smart contracts
- Hardhat for Ethereum development environment
- React for frontend
- ethers.js for blockchain interactions
- IPFS simulation for health record storage (can be extended to use real IPFS)
