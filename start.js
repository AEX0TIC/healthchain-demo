console.log(`
===== HEALTHCHAIN DEMO =====

Follow these steps to run the project:

1. Start the local blockchain in a NEW terminal window:
   npm run blockchain

2. In another NEW terminal, deploy the smart contract:
   npm run deploy

3. Start the frontend application in another NEW terminal:
   npm run frontend

4. Connect MetaMask to localhost:8545 network and import an account:
   - Add network with RPC URL: http://localhost:8545
   - Import an account using one of the private keys from the blockchain terminal

IMPORTANT: If you see "address already in use" errors, try these commands:
   - Windows: taskkill /f /im node.exe  (WARNING: This kills all Node.js processes)
   - Mac/Linux: pkill node

Note: The contract address shown in the deploy output should match in 
      frontend/src/contract.js (currently set to: 0x5FbDB2315678afecb367f032d93F642f64180aa3)

===============================
`); 