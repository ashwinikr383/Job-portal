import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SeekerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        if (!storedUser || !token || storedUser.role !== 'Seeker') {
          alert('Please log in as a job seeker to view this dashboard.');
          navigate('/login/seeker');
          return;
        }

        setUser(storedUser);
        const res = await axios.get(`http://localhost:5000/api/applications/user/${storedUser._id}`);
        setApplications(res.data);
      } catch (err) {
        console.error('Failed to load seeker applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Interviewing': return 'text-brand-blue border-brand-blue shadow-[0_0_10px_rgba(0,204,255,0.3)]';
      case 'Offer Received': return 'text-[#00ff88] border-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.3)]'; 
      case 'Rejected': return 'text-brand-pink border-brand-pink shadow-[0_0_10px_rgba(255,0,51,0.3)]'; 
      default: return 'text-yellow-400 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.3)]'; 
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const activeApplications = applications.length;
  const interviewsSecured = applications.filter(app => app.status === 'Interviewing').length;
  const profileViews = activeApplications * 8 + 24;
  const hasResumeText = user?.resume?.text && user.resume.text.trim().length > 0;
  const hasResumeFile = user?.resume?.file?.filename;

  if (!user) {
    return <div className="text-center py-12 text-slate-400">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full text-white">
      
      {/* Profile Header */}
      <div className="flex flex-wrap items-center gap-6 mb-12">
        <div className="relative w-24 h-24 bg-brand-gradient flex justify-center items-center text-4xl font-black shadow-[0_0_20px_rgba(0,204,255,0.4)]"
             style={{ clipPath: 'polygon(20% 0%, 100% 0, 100% 80%, 80% 100%, 0 100%, 0% 20%)' }}>
          {getInitials(user.name)}
          <div className="absolute top-0 left-0 w-2 h-2 bg-white"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-white"></div>
        </div>
        
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            Welcome back, <span className="text-brand-pink drop-shadow-[0_0_10px_rgba(255,0,51,0.5)]">
              {user.name}
            </span>
          </h2>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] mt-2">
            Operative Status: <span className="text-brand-blue">Active</span> | Role: <span className="text-brand-pink">{user.role}</span>
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card p-6 text-center border-t-4 border-brand-blue">
          <h3 className="text-5xl font-black mb-2">{activeApplications}</h3>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Active Applications</p>
        </div>
        <div className="glass-card p-6 text-center border-t-4 border-[#00ff88]">
          <h3 className="text-5xl font-black mb-2">{interviewsSecured}</h3>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Interviews Secured</p>
        </div>
        <div className="glass-card p-6 text-center border-t-4 border-brand-pink">
          <h3 className="text-5xl font-black mb-2">{profileViews}</h3>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Profile Views</p>
        </div>
      </div>

      {/* Resume Status Card */}
      <div className="mb-12 glass-card p-6 border-l-4 border-brand-pink">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-widest mb-2">Resume Status</h3>
            <div className="flex gap-4 text-sm">
              <span className={`font-bold uppercase tracking-wider px-3 py-1 rounded-lg ${hasResumeText ? 'bg-[#00ff88]/20 text-[#00ff88]' : 'bg-slate-700/50 text-slate-500'}`}>
                {hasResumeText ? '✓ Text Resume' : '○ Text Resume'}
              </span>
              <span className={`font-bold uppercase tracking-wider px-3 py-1 rounded-lg ${hasResumeFile ? 'bg-brand-blue/20 text-brand-blue' : 'bg-slate-700/50 text-slate-500'}`}>
                {hasResumeFile ? '✓ File Uploaded' : '○ File Upload'}
              </span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/update-resume')}
            className="px-6 py-3 bg-brand-pink text-white font-black uppercase tracking-[0.2em] text-xs transition-all hover:shadow-[0_0_20px_rgba(255,0,51,0.6)] rounded-lg"
          >
            Manage Resume
          </button>
        </div>

        {/* Resume Preview */}
        {(hasResumeText || hasResumeFile) && (
          <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-white/10">
            {hasResumeText && (
              <div className="mb-4">
                <p className="text-xs font-bold text-brand-pink uppercase tracking-widest mb-2">Text Resume Preview</p>
                <p className="text-sm text-slate-300 line-clamp-3">{user.resume.text}</p>
              </div>
            )}
            {hasResumeFile && (
              <div>
                <p className="text-xs font-bold text-brand-blue uppercase tracking-widest mb-2">Uploaded File</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{user.resume.file.filename}</p>
                    <p className="text-xs text-slate-400">Uploaded: {new Date(user.resume.file.uploadDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-wrap lg:flex-nowrap gap-8">
        
        {/* Left Column: Applications Tracker */}
        <div className="flex-grow flex flex-col gap-4 min-w-[60%]">
          <h3 className="text-2xl font-black uppercase tracking-widest mb-4">Mission Log (Applications)</h3>
          
          {applications.map((app) => (
            <div key={app._id} className="glass-card p-6 flex justify-between items-center flex-wrap gap-4 border-l-4 transition-all hover:bg-white/5">
              <div>
                <h4 className="text-xl font-black">{app.job?.title || 'Unknown Role'}</h4>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{app.job?.company || 'Unknown Company'}</p>
                <p className="text-slate-500 text-xs mt-2">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div className="flex flex-col items-end gap-3">
                <span className={`px-4 py-1 text-xs font-black uppercase tracking-widest border bg-black/40 rounded-lg ${getStatusStyle(app.status)}`}>
                  {app.status || 'Pending Review'}
                </span>
                <button
                  onClick={() => navigate(`/job/${app.job?._id}`)}
                  className="text-brand-blue hover:text-white text-xs font-bold uppercase tracking-widest hover:underline transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Quick Actions */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="glass-card p-6">
            <h3 className="text-xl font-black uppercase tracking-widest mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/update-resume')}
                className="w-full py-3 bg-brand-pink text-white font-black uppercase tracking-[0.2em] text-xs transition-all hover:shadow-[0_0_20px_rgba(255,0,51,0.6)] rounded-lg"
              >
                📝 Update Resume
              </button>
              <button 
                onClick={() => navigate('/jobs')}
                className="w-full py-3 bg-brand-blue text-slate-900 font-black uppercase tracking-[0.2em] text-xs transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] rounded-lg"
              >
                🔍 Browse Jobs
              </button>
              <button 
                onClick={() => navigate('/update-resume')}
                className="w-full py-3 bg-transparent border-2 border-[#00ff88] text-[#00ff88] font-black uppercase tracking-[0.2em] text-xs transition-all hover:bg-[#00ff88]/10 rounded-lg"
              >
                ⚡ Edit Skills
              </button>
              <button 
                onClick={() => navigate('/logout')}
                className="w-full py-3 bg-transparent border-2 border-slate-600 text-slate-400 font-black uppercase tracking-[0.2em] text-xs transition-all hover:border-slate-400 hover:text-slate-200 rounded-lg"
              >
                🚪 Logout
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-black uppercase tracking-widest mb-4">Profile Strength</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-400">Resume</span>
                  <span className="text-xs font-bold text-brand-pink">{hasResumeText && hasResumeFile ? '100%' : hasResumeText || hasResumeFile ? '50%' : '0%'}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-brand-pink h-2 rounded-full transition-all"
                    style={{ width: `${hasResumeText && hasResumeFile ? '100%' : hasResumeText || hasResumeFile ? '50%' : '0%'}` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-400">Profile</span>
                  <span className="text-xs font-bold text-brand-blue">75%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-brand-blue h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;