import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supaBaseClient';

const LoginPage = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Verify token and mark as used
      const { data: tokenData, error: tokenError } = await supabase
        .from('access_tokens')
        .select('*')
        .eq('token', token)
        .eq('is_used', false)
        .single();

      if (tokenError || !tokenData) {
        setError('Invalid or already used token');
        return;
      }

      // Create user entry
      const { error: userError } = await supabase
        .from('users')
        .insert([
          {
            access_token: token,
            email: email // if collecting email
          }
        ]);

      if (userError) throw userError;

      // Mark token as used
      const { error: updateError } = await supabase
        .from('access_tokens')
        .update({ is_used: true })
        .eq('token', token);

      if (updateError) throw updateError;

      // Store token for future requests
      localStorage.setItem('userToken', token);
      
      // Navigate to first test
      navigate('/personality');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Enter Access Token</h1>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            placeholder="Enter your access token"
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Access Tests
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;