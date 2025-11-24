import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0xC81b55061c89159AD39776091Ba9b25d73A0ae42";

const CONTRACT_ABI = [
  "function registerProject(string memory _name, string memory _location, uint256 _area) public returns (uint256)",
  "function issueCredits(uint256 _projectId, uint256 _amount, string memory _verificationHash) public returns (uint256)",
  "function transferCredits(address _to, uint256 _creditId, uint256 _amount) public",
  "function retireCredits(uint256 _creditId, uint256 _amount) public",
  "function getProject(uint256 _projectId) public view returns (tuple(uint256 projectId, string name, string location, uint256 area, address owner, uint256 totalCreditsIssued, bool isActive, uint256 registeredAt))",
  "function getCredit(uint256 _creditId) public view returns (tuple(uint256 creditId, uint256 projectId, uint256 amount, uint256 issuedAt, string verificationHash, bool isRetired))",
  "function getUserProjects(address _user) public view returns (uint256[])",
  "function getCreditBalance(address _user, uint256 _creditId) public view returns (uint256)"
];

export const connectWallet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      return accounts[0];
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  } else {
    alert("Please install MetaMask!");
    throw new Error("No wallet found");
  }
};

export const getContract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  return contract;
};

export const registerProject = async (name, location, area) => {
  const contract = await getContract();
  const tx = await contract.registerProject(name, location, area);
  await tx.wait();
  return tx;
};

export const issueCredits = async (projectId, amount, hash) => {
  const contract = await getContract();
  const tx = await contract.issueCredits(projectId, amount, hash);
  await tx.wait();
  return tx;
};

export const getProject = async (projectId) => {
  const contract = await getContract();
  const project = await contract.getProject(projectId);
  return project;
};

export const getUserBalance = async (address, creditId) => {
  const contract = await getContract();
  const balance = await contract.getCreditBalance(address, creditId);
  return balance.toString();
};