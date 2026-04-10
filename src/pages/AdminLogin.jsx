import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // MOCK ADMIN AUTH
    const adminEmail = "admin@1.com";
    const adminPassword = "boss";

    if (email === adminEmail && password === adminPassword) {
      setError('');
      navigate('/admin/dashboard');
    } else {
      setError('Unauthorized access. Invalid admin credentials.');
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