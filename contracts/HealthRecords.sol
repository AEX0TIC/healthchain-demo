// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthRecords {
    // Mapping from patient to their records
    mapping(address => string[]) private patientRecords;
    
    // Mapping from patient to authorized doctors
    mapping(address => mapping(address => bool)) private accessControl;
    
    // Events
    event RecordAdded(address indexed patient, string ipfsHash);
    event AccessGranted(address indexed patient, address indexed doctor);
    event AccessRevoked(address indexed patient, address indexed doctor);
    
    // Add a new medical record
    function addRecord(string memory ipfsHash) public {
        patientRecords[msg.sender].push(ipfsHash);
        emit RecordAdded(msg.sender, ipfsHash);
    }
    
    // Grant access to a doctor
    function grantAccess(address doctor) public {
        accessControl[msg.sender][doctor] = true;
        emit AccessGranted(msg.sender, doctor);
    }
    
    // Revoke access from a doctor
    function revokeAccess(address doctor) public {
        accessControl[msg.sender][doctor] = false;
        emit AccessRevoked(msg.sender, doctor);
    }
    
    // Get records if authorized
    function getRecords(address patient) public view returns (string[] memory) {
        // Patient can access their own records
        if (msg.sender == patient) {
            return patientRecords[patient];
        }
        
        // Doctor can access if authorized
        require(accessControl[patient][msg.sender], "Not authorized to view these records");
        return patientRecords[patient];
    }
    
    // Check if a doctor has access to a patient's records
    function hasAccess(address patient, address doctor) public view returns (bool) {
        return accessControl[patient][doctor];
    }
}