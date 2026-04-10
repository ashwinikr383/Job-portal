import React, { useState, useEffect } from 'react';

const SeekerDashboard = () => {
  // 1. STATE FOR DYNAMIC USER
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Pull the operative's data from the encrypted localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Mock data for the user's job applications
  const [applications] = useState([
    { id: 1, role: 'Frontend React Developer', company: 'Neon Wave Tech', date: 'Oct 24, 2026', status: 'Interviewing' },
    { id: 2, role: 'Cybersecurity Analyst', company: 'Rosenberg & Associates', date: 'Oct 20, 2026', status: 'Pending Review' },
    { id: 3, role: 'Smart Contract Auditor', company: 'Ocean View Finance', date: 'Oct 15, 2026', status: 'Offer Received' },
    { id: 4, role: 'Junior UI Designer', company: 'Starfish Studios', date: 'Oct 10, 2026', status: 'Rejected' },
  ]);

  // Helper function returning Tailwind classes for Cyberpunk colors
  const getStatusStyle = (status) => {
    switch(status) {
      case 'Interviewing': return 'text-brand-blue border-brand-blue shadow-[0_0_10px_rgba(0,204,255,0.3)]';
      case 'Offer Received': return 'text-[#00ff88] border-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.3)]'; 
      case 'Rejected': return 'text-brand-pink border-brand-pink shadow-[0_0_10px_rgba(255,0,51,0.3)]'; 
      default: return 'text-yellow-400 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.3)]'; 
    }
  };

  // Get Initials for Avatar (e.g., "Ayush Sharma" -> "AS")
  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full text-white">
      
      {/* Profile Header */}
      <div className="flex flex-wrap items-center gap-6 mb-12">
        {/* Dynamic Avatar */}
        <div className="relative w-24 h-24 bg-brand-gradient flex justify-center items-center text-4xl font-black shadow-[0_0_20px_rgba(0,204,255,0.4)]"
             style={{ clipPath: 'polygon(20% 0%, 100% 0, 100% 80%, 80% 100%, 0 100%, 0% 20%)' }}>
          {getInitials(user?.name || "Ayush")}
          <div className="absolute top-0 left-0 w-2 h-2 bg-white"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-white"></div>
        </div>
        
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            {/* DYNAMIC NAME INJECTED HERE */}
            Welcome back, <span className="text-brand-pink drop-shadow-[0_0_10px_rgba(255,0,51,0.5)]">
              {user?.name || "Ayush"}
            </span>
          </h2>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] mt-2">
            Operative Status: <span className="text-brand-blue">Active</span> | Specialization: Full-Stack Heists
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card p-6 text-center border-t-4 border-brand-blue">
          <h3 className="text-5xl font-black mb-2">12</h3>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Active Applications</p>
        </div>
        <div className="glass-card p-6 text-center border-t-4 border-[#00ff88]">
          <h3 className="text-5xl font-black mb-2">3</h3>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Interviews Secured</p>
        </div>
        <div className="glass-card p-6 text-center border-t-4 border-brand-pink">
          <h3 className="text-5xl font-black mb-2">48</h3>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Profile Views</p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-wrap lg:flex-nowrap gap-8">
        
        {/* Left Column: Applications Tracker */}
        <div className="flex-grow flex flex-col gap-4 min-w-[60%]">
          <h3 className="text-2xl font-black uppercase tracking-widest mb-4">Mission Log (Applications)</h3>
          
          {applications.map(app => (
            <div key={app.id} className="glass-card p-6 flex justify-between items-center flex-wrap gap-4 border-l-4 transition-all hover:bg-white/5">
              <div>
                <h4 className="text-xl font-black">{app.role}</h4>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{app.company}</p>
                <p className="text-slate-500 text-xs mt-2">Applied: {app.date}</p>
              </div>
              
              <div className="flex flex-col items-end gap-3">
                <span className={`px-4 py-1 text-xs font-black uppercase tracking-widest border bg-black/40 ${getStatusStyle(app.status)}`}>
                  {app.status}
                </span>
                <button className="text-brand-blue hover:text-white text-xs font-bold uppercase tracking-widest hover:underline transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Profile Actions */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="glass-card p-6">
            <h3 className="text-xl font-black uppercase tracking-widest mb-4">Arsenal (Profile)</h3>
            <p className="text-slate-400 text-xs font-bold leading-relaxed mb-6">
              Your resume was last updated 2 days ago. Keep it fresh to attract top syndicates.
            </p>
            <button 
              className="w-full mb-4 py-3 bg-brand-pink text-white font-black uppercase tracking-[0.2em] text-xs transition-all hover:shadow-[0_0_20px_rgba(255,0,51,0.6)]"
              style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
            >
              Update Resume
            </button>
            <button 
              className="w-full py-3 bg-transparent border-2 border-brand-blue text-brand-blue font-black uppercase tracking-[0.2em] text-xs transition-all hover:bg-brand-blue hover:text-slate-900"
              style={{ clipPath: 'polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%)' }}
            >
              Edit Skills
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;