@echo off
echo Starting HealthChain Demo...

REM Kill any existing node processes that might cause port conflicts
taskkill /f /im node.exe 2>nul

REM Start blockchain in a new window
start cmd /k "npm run blockchain"
echo Started blockchain in a new window. Wait for it to initialize...
timeout /t 5

REM Deploy smart contract
start cmd /k "npm run deploy && echo Contract deployed! Now starting frontend... && timeout /t 3 && npm run frontend"
echo Started deployment and frontend in a new window.

REM Show startup instructions
node start.js

echo All processes started! Follow the instructions above to use the application. 