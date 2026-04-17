import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Authentication failed.');
      }

      // Store auth data so protected actions work correctly
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin login failed:', err);
      setError(err.response?.data?.message || 'Unauthorized access. Invalid admin credentials.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '40px', textAlign: 'center', borderRadius: '16px', borderTop: '4px solid red' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '5px', color: 'red' }}>
          ADMIN PORTAL
        </h2>
        <p style={{ opacity: 0.8, marginBottom: '20px', fontWeight: '600' }}>
          Restricted access. Please log in.
        </p>

        {error && (
          <div style={{ background: 'rgba(255, 0, 0, 0.1)', border: '1px solid red', color: 'red', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontWeight: '600', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="email" 
            placeholder="Admin Email" 
            className="glass-input" 
            style={{ padding: '15px', borderRadius: '8px', fontSize: '1rem', width: '100%' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="glass-input" 
            style={{ padding: '15px', borderRadius: '8px', fontSize: '1rem', width: '100%' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" className="btn-primary" style={{ padding: '15px', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', marginTop: '10px', backgroundColor: 'red', color: 'white', border: 'none' }}>
            Enter System
          </button>
        </form>
      </div>

    </div>
  );
};

export default AdminLogin;