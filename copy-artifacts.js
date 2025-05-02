const fs = require('fs');
const path = require('path');

console.log('Checking contract artifacts in the frontend...');

// The hardhat.config.js is already configured to put artifacts in frontend/src/artifacts
// So we just need to check if the directory and file exist
const destDir = path.join(__dirname, 'frontend', 'src', 'artifacts', 'contracts', 'HealthRecords.sol');
const artifactFile = path.join(destDir, 'HealthRecords.json');

// Check if directory exists
if (!fs.existsSync(destDir)) {
  console.log(`Directory doesn't exist: ${destDir}`);
  console.log('Creating directory...');
  fs.mkdirSync(destDir, { recursive: true });
}

// Check if artifact file exists
if (fs.existsSync(artifactFile)) {
  console.log(`Artifact file exists at: ${artifactFile}`);
  console.log('Everything is set up correctly!');
} else {
  console.error(`ERROR: Artifact file not found: ${artifactFile}`);
  console.log('You need to compile the contract with: npx hardhat compile');
  process.exit(1);
}

console.log('Contract artifacts are ready for the frontend!'); 