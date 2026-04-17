import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      if (response.data.user) {
        if (response.data.user.role !== 'Seeker') {
          alert('Access denied: This login page is for job seekers only. Please use the employer login if you are an employer.');
          return;
        }

        // 1. Save User and Token to LocalStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        const role = response.data.user.role?.toLowerCase();
        alert(`Welcome back, ${response.data.user.name}! Access Level: ${role}`); 
        
        // 2. DYNAMIC REDIRECT BASED ON ROLE
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'employer') {
          navigate('/employer-dashboard');
        } else {
          navigate('/seeker-dashboard');
        }
      }

    } catch (error) {
      alert(error.response?.data?.message || "Login Failed: Check your credentials.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl border border-white shadow-2xl w-full max-w-md z-10">
        <div className="text-center mb-10">
          {/* Change title to be more generic since both can use this page */}
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
            System <span className="text-brand-blue">Access</span>
          </h2>
          <p className="text-slate-500 font-medium mt-2 italic">Authenticate to enter the ViceJobs grid.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-2 ml-1">
              Operative Email
            </label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-4 bg-slate-100 border border-slate-200 rounded-2xl focus:border-brand-blue outline-none transition-all font-bold text-slate-900"
              placeholder="e.g. ayush@network.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-2 ml-1">
              Access Key
            </label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-4 bg-slate-100 border border-slate-200 rounded-2xl focus:border-brand-pink outline-none transition-all font-bold text-slate-900"
              placeholder="••••••••"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-center block hover:bg-brand-blue transition-all shadow-lg active:scale-95"
          >
            INITIALIZE SESSION
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-slate-600 font-medium">
            New operative?{' '}
            <Link to="/register" className="text-brand-pink font-bold hover:underline">
              Register Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;