import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supaBaseClient';

const LoginPage = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const clearPreviousResponses = async (userToken) => {
    try {
      // Clear responses from localStorage
      localStorage.removeItem('all_test_responses');
      
      // Clear responses from database for this token
      const { error: deleteError } = await supabase
        .from('responses')
        .delete()
        .eq('access_token', userToken);

      if (deleteError) {
        console.error('Error clearing previous responses:', deleteError);
      }
    } catch (err) {
      console.error('Error in clearPreviousResponses:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // First, check if the token exists in the access_tokens table
      const { data: tokenData, error: tokenError } = await supabase
        .from('access_tokens')
        .select('*')
        .eq('token', token)
        .maybeSingle();

      if (tokenError) {
        console.error('Token verification error:', tokenError);
        setError('Error verifying token. Please try again.');
        setIsLoading(false);
        return;
      }

      if (!tokenData) {
        setError('Invalid token. Please check your token and try again.');
        setIsLoading(false);
        return;
      }

      if (tokenData.is_used) {
        setError('This token has already been used. Please contact support for a new token.');
        setIsLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem('userToken', token);
      
      // Clear any previous responses for this token
      await clearPreviousResponses(token);
      
      // Mark token as used
      const { error: updateError } = await supabase
        .from('access_tokens')
        .update({ is_used: true })
        .eq('token', token);

      if (updateError) {
        console.error('Error updating token:', updateError);
        // Don't return here, as the user is already logged in
      }

      // Navigate to instructions page
      navigate('/instructions');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Access Tests'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;