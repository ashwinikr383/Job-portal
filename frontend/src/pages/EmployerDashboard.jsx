import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployerDashboard = () => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        if (!user || !token || user.role !== 'Employer') {
          alert('Access denied: Employer access required. Please login with an employer account.');
          navigate('/employer-login');
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/jobs/employer/${user._id}/applications`);
        setActiveJobs(res.data);
      } catch (err) {
        console.error('Failed to load employer jobs:', err);
        alert('Unable to fetch your jobs right now.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [navigate]);

  const handleApplicantCount = (job) => {
    if (job.applications > 0) {
      alert(`${job.applications} applicant(s) have applied to "${job.title}".`);
    } else {
      alert(`No applications have arrived for "${job.title}" yet.`);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">SYNCING EMPLOYER NETWORK...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-white">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-5xl font-black uppercase tracking-tighter">Employer <span className="text-brand-blue">Dashboard</span></h2>
          <p className="text-slate-400 mt-3">Manage your postings in one place and review applicant activity instantly.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/post-job')}
            className="bg-brand-gradient text-white px-6 py-3 rounded-3xl font-black uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] transition"
          >
            Post New Job
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {activeJobs.length === 0 ? (
          <div className="glass-card p-10 border border-white/10 bg-slate-950/70">
            <h3 className="text-2xl font-black mb-4">No active contracts yet</h3>
            <p className="text-slate-400">You can publish a new role by using the Post New Job button. Once seekers apply, application counts will appear here.</p>
          </div>
        ) : activeJobs.map((job) => (
          <div key={job._id} className="glass-card p-8 border border-white/10 bg-slate-950/70 shadow-2xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-3 py-1 text-brand-blue text-xs font-bold uppercase tracking-[0.25em]">{job.company}</span>
                  <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-slate-200 text-xs font-semibold">{job.location}</span>
                </div>
                <h3 className="text-3xl font-black text-white mb-2">{job.title}</h3>
                <p className="text-slate-400 text-sm uppercase tracking-[0.2em] font-bold">{job.salary}</p>
              </div>

              <div className="flex flex-col gap-4 sm:items-end">
                <span className="inline-flex items-center rounded-full bg-brand-pink/10 text-brand-pink px-4 py-2 text-sm font-bold tracking-[0.2em] uppercase">
                  {job.applications || 0} Applied
                </span>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/employer/job/${job._id}/applicants`)}
                    className="bg-brand-blue text-slate-950 px-5 py-3 rounded-3xl font-black uppercase tracking-[0.15em] hover:scale-[1.02] transition"
                  >
                    View Applicants
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/job/${job._id}`)}
                    className="bg-white/10 text-white px-5 py-3 rounded-3xl font-black uppercase tracking-[0.15em] border border-white/10 hover:bg-white/20 transition"
                  >
                    Review Listing
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployerDashboard;