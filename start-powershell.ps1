Write-Host "Starting HealthChain Demo..."

# Kill any existing node processes that might cause port conflicts
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Write-Host "Killed any existing node processes"

# Make sure contract is compiled and artifacts are available
Write-Host "Checking contract artifacts..."
npx hardhat compile
node copy-artifacts.js

# Start blockchain in a new window
Start-Process powershell -ArgumentList "-Command npm run blockchain"
Write-Host "Started blockchain in a new window. Wait for it to initialize..."
Start-Sleep -Seconds 5

# Deploy smart contract and start frontend
Start-Process powershell -ArgumentList "-Command npm run deploy; Write-Host 'Contract deployed! Starting frontend...'; Start-Sleep -Seconds 3; cd frontend; npm start"
Write-Host "Started deployment and frontend in a new window."

# Show startup instructions
node start.js

Write-Host "All processes started! Follow the instructions above to use the application." 