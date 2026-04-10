import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      if (res.data.user) {
        // CRITICAL: Save the ID for the dashboard to use later
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('token', res.data.token);
        
        alert(`Welcome, ${res.data.user.name}`);
        navigate('/employer-dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center py-20 bg-slate-900 min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-2xl w-96">
        <h2 className="text-2xl font-black mb-5 text-center">EMPLOYER LOGIN</h2>
        <input 
          type="email" placeholder="Email" required className="w-full p-3 mb-4 border rounded"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          type="password" placeholder="Password" required className="w-full p-3 mb-6 border rounded"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button className="w-full bg-blue-500 text-white p-3 rounded font-bold hover:bg-blue-600">
          ACCESS DASHBOARD
        </button>
      </form>
    </div>
  );
};

export default EmployerLogin;