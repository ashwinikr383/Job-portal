import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-pink/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-blue/20 blur-[120px] rounded-full"></div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Main Heading - Forced White/Neon */}
        <h1 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter mb-6">
          Level Up Your <span className="text-brand-pink drop-shadow-[0_0_15px_rgba(255,0,204,0.5)]">Career</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-300 font-medium mb-10 leading-relaxed">
          Enter the ultimate professional network. Find high-paying gigs, 
          build your empire, and connect with top-tier organizations.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Link 
            to="/jobs" 
            className="bg-brand-gradient text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all w-full md:w-auto"
          >
            Find Jobs
          </Link>
          
          <Link 
            to="/login" 
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white/20 transition-all w-full md:w-auto"
          >
            Join Syndicate
          </Link>
        </div>

        {/* Stats / Trending */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-8">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Trending: <span className="text-brand-blue ml-2">React Developer</span>
          </div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Active Gigs: <span className="text-brand-pink ml-2">2,234</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;