import React from 'react';
import { Link, useParams } from 'react-router-dom';

const JobDetails = () => {
  // In a real app, you would use this ID to fetch data from your MERN backend
  // const { id } = useParams(); 
  
  // Mock data for the specific job
  const job = {
    title: 'Senior React Developer',
    company: 'Neon Wave Tech',
    location: 'Vice City (Remote)',
    type: 'Full-Time',
    salary: '$120k - $150k',
    posted: '2 days ago',
    applicants: 42,
    description: "Neon Wave Tech is looking for an elite frontend operative to build the next generation of our decentralized syndicate dashboards. You will be responsible for translating high-level heist plans into pixel-perfect, glassmorphic UI components.",
    responsibilities: [
      "Architect and build scalable React applications for our underground network.",
      "Collaborate with backend hackers to integrate secure REST APIs.",
      "Optimize application performance for maximum speed and evasion.",
      "Mentor junior operatives in the ways of modern JavaScript."
    ],
    requirements: [
      "5+ years of experience in React.js and modern frontend ecosystems.",
      "Deep understanding of Glassmorphism and CSS-in-JS.",
      "Experience with state management (Redux, Zustand, or Context API).",
      "Ability to stay calm under pressure during high-stakes deployments."
    ]
  };

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
              👁️ {job.applicants} Operatives Applied
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
              {job.responsibilities.map((req, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="glass-card" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '15px', color: '#00ff88' }}>Required Arsenal (Skills)</h3>
            <ul style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', fontSize: '1.05rem', paddingLeft: '20px' }}>
              {job.requirements.map((req, index) => (
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
            
            <button className="btn-primary" style={{ padding: '16px', borderRadius: '8px', fontSize: '1.1rem', width: '100%' }}>
              Accept Contract (Apply)
            </button>
            
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