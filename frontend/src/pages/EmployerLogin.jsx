import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      if (res.data.user) {
        if (res.data.user.role !== 'Employer') {
          alert('Access denied: This login page is for employers only. Please use the seeker login if you are a job seeker.');
          return;
        }

        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('token', res.data.token);
        
        // Using a smoother transition than a standard alert if you prefer
        navigate('/employer-dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6">
      {/* Background Glow Effect */}
      <div className="absolute w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] top-1/3 right-1/4"></div>
      
      <div className="relative w-full max-w-[440px] bg-[#f8fafc] rounded-[40px] p-12 shadow-2xl text-slate-900">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black tracking-tight text-[#0f172a]">
            SYSTEM <span className="text-cyan-500">ACCESS</span>
          </h2>
          <p className="text-slate-500 font-medium italic mt-2">
            Authenticate to enter the ViceJobs grid.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Operative Email
            </label>
            <input 
              type="email" 
              placeholder="admin@1.com" 
              required 
              className="w-full bg-[#ecf2ff] border-none p-4 rounded-xl text-lg focus:ring-2 focus:ring-cyan-500 transition-all outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Access Key
            </label>
            <input 
              type="password" 
              placeholder="••••" 
              required 
              className="w-full bg-[#ecf2ff] border-none p-4 rounded-xl text-lg focus:ring-2 focus:ring-cyan-500 transition-all outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          {/* Action Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#0f172a] text-white py-5 rounded-2xl font-black tracking-widest text-sm hover:bg-slate-800 transform active:scale-[0.98] transition-all shadow-xl shadow-slate-900/20"
          >
            {loading ? "INITIALIZING..." : "INITIALIZE SESSION"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-10 text-center text-sm font-bold text-slate-500">
          New operative? <span className="text-red-500 cursor-pointer hover:underline" onClick={() => navigate('/register')}>Register Account</span>
        </div>
      </div>
    </div>
  );
};

export default EmployerLogin;