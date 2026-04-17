import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Seeker', // Default role
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // This actually sends the data to your Node.js backend!
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      // Pop up the success message
      alert(response.data.message);
      
      // Redirect to the login page
      navigate('/login'); 
    } catch (error) {
      console.error("Registration Error:", error);
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      {/* Glassmorphism Card */}
      <div className="glass-card w-full max-w-md p-8 bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2 bg-brand-gradient bg-clip-text text-transparent">
          Join the Network
        </h2>
        <p className="text-gray-400 text-center mb-8">Create your operative profile</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="flex bg-[#0f172a] p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'Seeker' })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                formData.role === 'Seeker' ? 'bg-brand-blue text-white shadow-lg' : 'text-gray-400'
              }`}
            >
              Seeker
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'Employer' })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                formData.role === 'Employer' ? 'bg-brand-pink text-white shadow-lg' : 'text-gray-400'
              }`}
            >
              Employer
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-blue transition-colors text-white"
              placeholder="e.g. Tommy Vercetti"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-blue transition-colors text-white"
              placeholder="name@company.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-pink transition-colors text-white"
              placeholder="••••••••"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-white bg-brand-gradient hover:opacity-90 transition-opacity shadow-lg shadow-brand-blue/20"
          >
            Register to Mainframe
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-blue hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;