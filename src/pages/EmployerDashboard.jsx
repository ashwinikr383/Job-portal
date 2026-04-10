import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployerDashboard = () => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [newJob, setNewJob] = useState({ title: '', location: '', salary: '', type: 'Full-Time', description: '' });
  const [loading, setLoading] = useState(true);

  // 1. Load existing jobs from MongoDB on mount
  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        const res = await axios.get('http://localhost:5000/api/jobs/all');
        
        // Filter jobs so this employer only sees the ones they posted
        // We use == instead of === just in case one ID is a string and the other is an Object
        const myJobs = res.data.filter(job => job.postedBy === user._id || job.postedBy?._id === user._id);
        setActiveJobs(myJobs);
      } catch (err) {
        console.error("Failed to fetch jobs from the grid.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployerJobs();
  }, []);

  // 2. Real Database Deployment Logic
  const handlePostJob = async (e) => {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user._id) {
      alert("Session Expired: Please login again.");
      return;
    }

    const jobPayload = {
      title: newJob.title,
      company: user.name, 
      location: newJob.location,
      salary: newJob.salary,
      description: newJob.description,
      postedBy: user._id 
    };

    try {
      const res = await axios.post('http://localhost:5000/api/jobs/create', jobPayload);
      
      setActiveJobs([res.data, ...activeJobs]);
      setNewJob({ title: '', location: '', salary: '', type: 'Full-Time', description: '' });
      alert("CONTRACT DEPLOYED TO THE GRID");
    } catch (err) {
      console.error("Deployment failure details:", err.response?.data);
      alert(`Action failed: ${err.response?.data?.error || "Check backend console"}`);
    }
  };

  // Styles
  const cardStyle = { background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)' };
  const inputStyle = { padding: '12px', borderRadius: '8px', fontSize: '1rem', border: '1px solid #d1d5db', backgroundColor: '#f9fafb', color: '#111827' };

  if (loading) return <div className="p-10 font-bold text-center">ACCESSING COMMAND CENTER...</div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%', color: '#111827' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900' }}>
          Employer <span style={{ color: '#00d2ff' }}>Command Center</span>
        </h2>
        <p style={{ color: '#4b5563', fontSize: '1.1rem', fontWeight: '600' }}>
          Welcome back. Manage your operations below.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ ...cardStyle, padding: '20px', textAlign: 'center', borderTop: '4px solid #ff007f' }}>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '900' }}>{activeJobs.length}</h3>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase' }}>Active Listings</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
        {/* Left Column: Form */}
        <div style={{ ...cardStyle, flex: '1 1 400px', padding: '30px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px', borderBottom: '2px solid #f3f4f6', paddingBottom: '15px' }}>
            Initialize New Contract
          </h3>
          <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Job Title" required value={newJob.title} style={inputStyle} onChange={(e) => setNewJob({...newJob, title: e.target.value})} />
            <input type="text" placeholder="Location" required value={newJob.location} style={inputStyle} onChange={(e) => setNewJob({...newJob, location: e.target.value})} />
            <input type="text" placeholder="Salary" required value={newJob.salary} style={inputStyle} onChange={(e) => setNewJob({...newJob, salary: e.target.value})} />
            <textarea placeholder="Job Description..." rows="4" required value={newJob.description} style={{ ...inputStyle, resize: 'vertical' }} onChange={(e) => setNewJob({...newJob, description: e.target.value})}></textarea>
            <button type="submit" style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#00d2ff', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer' }}>
              Deploy Contract
            </button>
          </form>
        </div>

        {/* Right Column: List */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Active Operations</h3>
          {activeJobs.map(job => (
            <div key={job._id} style={{ ...cardStyle, padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#00d2ff', margin: 0 }}>{job.title}</h4>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '5px' }}>{job.location} | {job.salary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;