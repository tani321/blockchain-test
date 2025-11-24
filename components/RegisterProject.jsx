'use client';

import { useState } from 'react';
import { connectWallet, registerProject } from '../utils/blockchain';

export default function RegisterProject() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [wallet, setWallet] = useState('');

  const handleConnect = async () => {
    try {
      const address = await connectWallet();
      setWallet(address);
      alert('Wallet connected: ' + address);
    } catch (error) {
      alert('Failed to connect wallet');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!wallet) {
        await handleConnect();
      }
      
      const tx = await registerProject(name, location, parseInt(area));
      setTxHash(tx.hash);
      alert('Project registered successfully!');
      
      // Reset form
      setName('');
      setLocation('');
      setArea('');
    } catch (error) {
      console.error(error);
      alert('Error registering project: ' + error.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Register Blue Carbon Project</h2>
      
      {!wallet && (
        <button
          onClick={handleConnect}
          className="w-full mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      )}
      
      {wallet && (
        <p className="mb-4 text-sm text-green-600">
          Connected: {wallet.substring(0, 6)}...{wallet.substring(38)}
        </p>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Project Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Mumbai Mangrove Forest"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Mumbai, Maharashtra"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Area (hectares)</label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="100"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Registering...' : 'Register on Blockchain'}
        </button>
      </form>
      
      {txHash && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="text-sm font-medium">Transaction successful!</p>
          
           <a href={`https://sepolia.etherscan.io/tx/${txHash}`}

            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm break-all">
            View on Etherscan
          </a>
        </div>
      )}
    </div>
  );
}