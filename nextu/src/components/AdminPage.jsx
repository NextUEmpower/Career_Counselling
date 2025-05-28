import React, { useState, useEffect } from 'react';
import { supabase } from '../supaBaseClient';
import { generateToken } from '../utils/tokenGenerator';

const AdminPage = () => {
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchTokens();
    } else {
      alert('Invalid admin password');
    }
  };

  const fetchTokens = async () => {
    const { data, error } = await supabase
      .from('access_tokens')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tokens:', error);
      return;
    }
    setTokens(data);
    setIsLoading(false);
  };

  const generateNewToken = async () => {
    const newToken = generateToken();
    const { error } = await supabase
      .from('access_tokens')
      .insert([{ 
        token: newToken,
        is_used: false
      }]);

    if (error) {
      alert('Failed to generate token');
      return;
    }

    fetchTokens();
  };

  const deleteToken = async (tokenId) => {
    if (!window.confirm('Are you sure you want to delete this token?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('access_tokens')
        .delete()
        .eq('id', tokenId);

      if (error) {
        console.error('Error deleting token:', error);
        alert('Failed to delete token');
        return;
      }

      // Refresh the tokens list
      fetchTokens();
      alert('Token deleted successfully');
    } catch (err) {
      console.error('Delete operation failed:', err);
      alert('Failed to delete token');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <form onSubmit={handleAdminLogin} className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl mb-4">Admin Login</h2>
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter admin password"
          />
          <button 
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Access Token Management</h1>
        <button
          onClick={generateNewToken}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Generate New Token
        </button>
      </div>

      {isLoading ? (
        <p>Loading tokens...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Token</th>
              <th className="p-2 text-left">Created At</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => (
              <tr key={token.id} className="border-t">
                <td className="p-2">{token.token}</td>
                <td className="p-2">
                  {new Date(token.created_at).toLocaleString()}
                </td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded ${
                    token.is_used ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {token.is_used ? 'Used' : 'Available'}
                  </span>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => deleteToken(token.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    disabled={token.is_used}
                    title={token.is_used ? "Used tokens cannot be deleted" : "Delete token"}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;