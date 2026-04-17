import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  
  // 1. Get the user data from localStorage
  const user = JSON.parse(localStorage.getItem('user')); 
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token && !!user;

  const handleLogout = () => {
    localStorage.clear();
    alert("SYSTEM SHUTDOWN: Session terminated.");
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-black italic tracking-tighter">
          <span className="text-brand-blue">NEEDS</span>
          <span className="text-brand-pink">YOU</span>
        </Link>

        <div className="flex items-center gap-8 font-bold text-slate-600">
          
          {/* 2. Show "Browse Jobs" ONLY if Seeker is logged in */}
          {isLoggedIn && user?.role === 'Seeker' && (
            <>
              <Link to="/jobs" className="hover:text-brand-pink transition">Browse Jobs</Link>
              <Link to="/update-resume" className="hover:text-brand-pink transition">My Resume</Link>
            </>
          )}

          {/* 4. Show "Sign In" only if NOT logged in */}
          {!isLoggedIn ? (
            <Link to="/login" className="hover:text-brand-pink transition">Sign In</Link>
          ) : (
            <button 
              onClick={handleLogout}
              className="text-red-500 font-black uppercase text-xs tracking-widest cursor-pointer"
            >
              Logout
            </button>
          )}
          
        </div>
      </div>
    </nav>
  );
}