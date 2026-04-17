import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the session
    localStorage.clear();

    // Dramatic delay
    const timer = setTimeout(() => {
      navigate('/');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white">
      <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-black uppercase tracking-widest animate-pulse">
        Terminating <span className="text-brand-pink">Session...</span>
      </h2>
    </div>
  );
};

export default Logout;  