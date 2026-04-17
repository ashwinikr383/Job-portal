import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch real operatives from the database
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/all');
      setUsers(res.data);
    } catch (err) {
      console.error("System Error: Failed to scan network grid.", err);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Ban / unban button handler
  const handleBan = async (id, name, currentStatus) => {
    const action = currentStatus === 'Banned' ? 'Unban' : 'Ban';
    if (!window.confirm(`${action} ${name}?`)) return;

    try {
      const newStatus = currentStatus === 'Banned' ? 'Active' : 'Banned';
      const res = await axios.patch(`http://localhost:5000/api/users/${id}/status`, { status: newStatus });

      // Replace the updated user record in local state
      setUsers(users.map(user => user._id === id ? res.data.user : user));
    } catch (err) {
      console.error('Ban action failed:', err);
      alert(err.response?.data?.error || 'Action failed: check admin privileges or network.');
    }
  };

  // 3. Verify / revoke button handler
  const handleVerify = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/users/${id}/verify`);

      // Update the verified flag returned by the server
      setUsers(users.map(user => 
        user._id === id ? { ...user, isVerified: res.data.isVerified, status: res.data.status || user.status } : user
      ));
    } catch (err) {
      console.error('Verification failed:', err);
      alert(err.response?.data?.error || 'Verification failed: check admin privileges or network.');
    }
  };

  // Logic to separate the data into the two columns based on roles
  const seekers = users.filter(u => u.role?.toLowerCase() === 'seeker');
  const employers = users.filter(u => u.role?.toLowerCase() === 'employer');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0b10]">
        <div className="text-brand-blue font-black tracking-[0.3em] animate-pulse">
          SCANNING NETWORK GRID...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-white min-h-screen">
      {/* Header / page actions */}
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-5xl font-black uppercase italic mb-2">
            ADMIN <span className="text-brand-blue">PORTAL</span>
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-brand-pink font-bold tracking-widest uppercase text-sm">
              SYSTEM LEVEL: SUPERUSER ACCESS
            </p>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-brand-pink/50 to-transparent"></div>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/banned-users')}
          className="w-full md:w-auto px-6 py-3 bg-brand-blue text-slate-900 rounded-3xl font-black uppercase tracking-[0.2em] hover:bg-brand-blue/90 transition shadow-lg"
        >
          View Banned Users
        </button>
      </div>

      {/* Two-column user management panels */}
      <div className="grid md:grid-cols-2 gap-10">
        
        {/* COLUMN 1: Job Seekers */}
        <div className="glass-card p-8 border-l-4 border-brand-blue bg-slate-900/40 rounded-2xl shadow-2xl shadow-brand-blue/5">
          <h3 className="text-2xl font-black mb-8 uppercase tracking-wider flex items-center gap-3">
            <span className="w-2 h-2 bg-brand-blue rounded-full animate-ping"></span>
            Manage Job Seekers
          </h3>
          
          <div className="space-y-4">
            {seekers.map(user => (
              <div key={user._id} className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center bg-black/40 p-5 rounded-xl border border-white/5 hover:border-brand-blue/30 transition-all duration-300 group">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-lg text-white group-hover:text-brand-blue transition-colors">{user.name}</h4>
                    {user.isVerified && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-400 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-black">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-blue/70 font-bold uppercase tracking-widest">{user.email}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    {user.status === 'Verified' ? 'Verified' : user.status === 'Pending' ? 'Pending Verification' : user.status}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  <button
                    onClick={() => handleVerify(user._id)}
                    className={`px-4 py-2 text-[10px] font-black uppercase transition-all border ${
                      user.isVerified
                        ? 'bg-green-500/10 border-green-500 text-green-500 hover:bg-green-500 hover:text-white'
                        : 'bg-white border-white text-black hover:bg-brand-blue hover:text-white hover:border-brand-blue'
                    }`}
                  >
                    {user.isVerified ? 'REVOKE' : 'VERIFY'}
                  </button>
                  <button 
                    onClick={() => handleBan(user._id, user.name, user.status)}
                    className={`px-4 py-2 border text-[10px] font-black uppercase transition-all shadow-lg ${user.status === 'Banned' ? 'bg-green-500/10 border-green-500 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-brand-pink/10 border-brand-pink/50 text-brand-pink hover:bg-brand-pink hover:text-white'} `}
                  >
                    {user.status === 'Banned' ? 'UNBAN' : 'BAN'}
                  </button>
                </div>
              </div>
            ))}
            {seekers.length === 0 && (
              <p className="text-slate-600 italic border border-dashed border-slate-800 p-10 text-center rounded-xl">
                No seekers detected on the grid.
              </p>
            )}
          </div>
        </div>

        {/* COLUMN 2: Employers */}
        <div className="glass-card p-8 border-l-4 border-brand-pink bg-slate-900/40 rounded-2xl shadow-2xl shadow-brand-pink/5">
          <h3 className="text-2xl font-black mb-8 uppercase tracking-wider flex items-center gap-3">
            <span className="w-2 h-2 bg-brand-pink rounded-full animate-ping"></span>
            Manage Employers
          </h3>

          <div className="space-y-4">
            {employers.map(user => (
              <div key={user._id} className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center bg-black/40 p-5 rounded-xl border border-white/5 hover:border-brand-pink/30 transition-all duration-300">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-lg text-white">{user.name}</h4>
                    {user.isVerified && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-400 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-black">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] mt-1 text-slate-500">
                    {user.isVerified ? 'Verified Entity' : 'Pending Verification'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  <button 
                    onClick={() => handleVerify(user._id)}
                    className={`px-4 py-2 text-[10px] font-black uppercase transition-all border ${
                      user.isVerified 
                        ? 'bg-green-500/10 border-green-500 text-green-500 hover:bg-green-500 hover:text-white' 
                        : 'bg-white border-white text-black hover:bg-brand-blue hover:text-white hover:border-brand-blue'
                    }`}
                  >
                    {user.isVerified ? 'REVOKE' : 'VERIFY'}
                  </button>
                  <button 
                    onClick={() => handleBan(user._id, user.name, user.status)}
                    className={`px-4 py-2 border text-[10px] font-black uppercase transition-all shadow-lg ${user.status === 'Banned' ? 'bg-green-500/10 border-green-500 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-brand-pink/10 border-brand-pink/50 text-brand-pink hover:bg-brand-pink hover:text-white'} `}
                  >
                    {user.status === 'Banned' ? 'UNBAN' : 'BAN'}
                  </button>
                </div>
              </div>
            ))}
            {employers.length === 0 && (
              <p className="text-slate-600 italic border border-dashed border-slate-800 p-10 text-center rounded-xl">
                No employers detected on the grid.
              </p>
            )}
          </div>
        </div>

      </div>

      <footer className="mt-20 py-8 border-t border-white/5 text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.5em]">
        © 2026 ViceJobs Network // Unauthorized Access is Prohibited
      </footer>
    </div>
  );
};

export default AdminDashboard;