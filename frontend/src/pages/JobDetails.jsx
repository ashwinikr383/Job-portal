import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const JobDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(res.data);

        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser?.role === 'Seeker') {
          const appRes = await axios.get(`http://localhost:5000/api/applications/user/${storedUser._id}`);
          const hasExisting = appRes.data.some((app) => app.job?._id === id);
          setHasApplied(hasExisting);
        }
      } catch (err) {
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id]);

  const handleApply = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (!storedUser || !token || storedUser.role !== 'Seeker') {
      alert('Please sign in as a job seeker to apply for this role.');
      return navigate('/login/seeker');
    }

    setApplyLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/jobs/apply', {
        jobId: id,
        applicantId: storedUser._id
      });

      setNote('Application submitted successfully.');
      setJob((prev) => ({ ...prev, applications: response.data.applications }));
      setHasApplied(true);
    } catch (err) {
      console.error('Apply Error:', err);
      alert(err.response?.data?.error || 'Could not submit application.');
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">Loading job details...</div>;
  if (!job) return <div className="p-20 text-center font-bold">Job not found.</div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
      {/* Back Navigation */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/jobs" style={{ color: 'var(--neon-blue)', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ← Back to Operations Board
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="glass-card" style={{ padding: '40px', marginBottom: '30px', borderTop: '4px solid var(--neon-pink)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '10px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              {job.title}
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginBottom: '15px' }}>
              {job.company}
            </p>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>📍 {job.location}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>💼 {job.type}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>💰 {job.salary}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>⏱️ Posted {job.posted}</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--neon-blue)', fontWeight: '600', fontSize: '0.9rem' }}>
              👁️ {job.applications || 0} Operatives Applied
            </span>
          </div>
        </div>
      </div>

      {/* Content Split: Details & Sticky Sidebar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
        
        {/* Left Column: Full Job Details */}
        <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="glass-card" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '15px', color: 'var(--neon-blue)' }}>About the Contract</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', fontSize: '1.05rem' }}>
              {job.description}
            </p>
          </div>

          <div className="glass-card" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '15px', color: 'var(--neon-pink)' }}>Key Objectives (Responsibilities)</h3>
            <ul style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', fontSize: '1.05rem', paddingLeft: '20px' }}>
              {(job.responsibilities || []).map((req, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="glass-card" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '15px', color: '#00ff88' }}>Required Arsenal (Skills)</h3>
            <ul style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', fontSize: '1.05rem', paddingLeft: '20px' }}>
              {(job.requirements || []).map((req, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>{req}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* Right Column: Sticky Action Sidebar */}
        <div style={{ flex: '1 1 300px' }}>
          <div className="glass-card" style={{ 
            padding: '30px', 
            position: 'sticky', 
            top: '20px', /* Makes it stick when scrolling */
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px' 
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', textAlign: 'center' }}>Ready to Deploy?</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
              Ensure your portfolio and skills are up to date before accepting this contract.
            </p>
            
            <button
              type="button"
              onClick={handleApply}
              disabled={applyLoading || hasApplied}
              className="btn-primary"
              style={{ padding: '16px', borderRadius: '8px', fontSize: '1.1rem', width: '100%', opacity: applyLoading || hasApplied ? 0.65 : 1, cursor: applyLoading || hasApplied ? 'not-allowed' : 'pointer' }}
            >
              {applyLoading ? 'Applying...' : hasApplied ? 'Application Sent' : 'Accept Contract (Apply)'}
            </button>
            {note && <p style={{ color: 'rgba(0,255,136,0.9)', fontWeight: '700', textAlign: 'center' }}>{note}</p>}
            
            <button style={{ 
              padding: '16px', 
              borderRadius: '8px', 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.2)', 
              color: 'white', 
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
            >
              Bookmark for Later
            </button>
            
            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '10px 0' }} />
            
            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
              Report suspicious activity directly to syndicate admins.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JobDetails;