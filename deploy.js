const hre = require("hardhat");

async function main() {
  // Deploy the HealthRecords contract
  const HealthRecords = await hre.ethers.getContractFactory("HealthRecords");
  const healthRecords = await HealthRecords.deploy();

  await healthRecords.deployed();

  console.log("HealthRecords deployed to:", healthRecords.address);
  console.log("Note: Update this address in frontend/src/contract.js if needed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });