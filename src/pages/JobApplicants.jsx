import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const JobApplicants = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [statusSaving, setStatusSaving] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || !['Employer', 'Admin'].includes(storedUser.role)) {
          alert('Employer or admin access required to view applicants.');
          navigate('/employer-login');
          return;
        }

        setCurrentUser(storedUser);

        const [jobRes, appsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/jobs/${id}`),
          axios.get(`http://localhost:5000/api/applications/job/${id}`)
        ]);

        setJob(jobRes.data);
        setApplications(appsRes.data);
      } catch (err) {
        console.error('Failed to load applicants:', err);
        alert('Unable to load applicants for this listing.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchApplicants();
  }, [id, navigate]);

  const handleStatusUpdate = async (applicationId, status) => {
    if (!applicationId || !status) return;
    setStatusSaving(applicationId);

    try {
      const res = await axios.patch(`http://localhost:5000/api/applications/${applicationId}/status`, { status });
      setApplications(applications.map((app) => app._id === applicationId ? res.data.application : app));
    } catch (err) {
      console.error('Status update failed:', err);
      alert(err.response?.data?.error || 'Could not update application status.');
    } finally {
      setStatusSaving(null);
    }
  };

  const handleBanApplicant = async (userId, name) => {
    if (!userId) return;
    if (!window.confirm(`Ban ${name || 'this applicant'} from the system?`)) return;

    setActionLoading(userId + '-ban');
    try {
      const res = await axios.patch(`http://localhost:5000/api/users/${userId}/status`, { status: 'Banned' });
      setApplications(applications.map((app) => app.applicant?._id === userId ? { ...app, applicant: res.data.user } : app));
      alert(`${name || 'Applicant'} has been banned.`);
    } catch (err) {
      console.error('Ban applicant failed:', err);
      alert(err.response?.data?.error || 'Could not ban applicant.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveApplicant = async (applicationId, applicantName) => {
    if (!applicationId) return;
    if (!window.confirm(`Remove ${applicantName || 'this applicant'} from the roster?`)) return;

    setActionLoading(applicationId + '-remove');
    try {
      await axios.delete(`http://localhost:5000/api/applications/${applicationId}`);
      setApplications(applications.filter((app) => app._id !== applicationId));
      alert(`${applicantName || 'Applicant'} has been removed.`);
    } catch (err) {
      console.error('Remove applicant failed:', err);
      alert(err.response?.data?.error || 'Could not remove applicant.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="p-20 text-center text-white font-bold">Loading applicant roster...</div>;

  const backRoute = currentUser?.role === 'Admin' ? '/admin/dashboard' : '/employer-dashboard';

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-white">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-5xl font-black uppercase tracking-tighter">Applicant Roster</h2>
          <p className="text-slate-400 mt-3">Review live applicant submissions for this job posting.</p>
        </div>
        <button
          onClick={() => navigate(backRoute)}
          className="bg-white/10 text-white px-6 py-3 rounded-3xl font-black uppercase tracking-[0.2em] border border-white/10 hover:bg-white/20 transition"
        >
          Back to Dashboard
        </button>
      </div>

      {job && (
        <div className="glass-card p-8 border border-white/10 bg-slate-950/70 mb-8">
          <h3 className="text-3xl font-black text-white">{job.title}</h3>
          <p className="text-slate-400 mt-2">{job.company} • {job.location} • {job.salary}</p>
          <p className="text-slate-500 mt-2 text-sm">Posted: {job.posted || 'Today'}</p>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="glass-card p-10 border border-white/10 bg-slate-950/70 text-slate-400">
          No applicants have submitted yet. Check back once seekers apply.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="glass-card p-6 bg-slate-950/70 border border-white/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-[0.2em] mb-2">Applicant</p>
                <h4 className="text-2xl font-black text-white">{app.applicant?.name || 'Unknown'}</h4>
                <p className="text-slate-400 text-sm mb-3">{app.applicant?.email || 'No email available'}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-brand-blue/10 text-brand-blue px-3 py-1 text-xs font-black uppercase tracking-[0.2em]">
                    {app.status || 'Pending Review'}
                  </span>
                  {app.applicant?.status === 'Banned' && (
                    <span className="inline-flex items-center rounded-full bg-brand-pink/10 text-brand-pink px-3 py-1 text-xs font-black uppercase tracking-[0.2em]">
                      BANNED
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Applied</p>
                  <p className="font-black text-white">{new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
                  <button
                    onClick={() => handleStatusUpdate(app._id, 'Interviewing')}
                    disabled={statusSaving === app._id}
                    className="px-4 py-2 bg-brand-blue text-slate-900 rounded-full text-xs font-black uppercase tracking-[0.15em] hover:bg-brand-blue/90 transition"
                  >
                    Interviewing
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                    disabled={statusSaving === app._id}
                    className="px-4 py-2 bg-brand-pink text-white rounded-full text-xs font-black uppercase tracking-[0.15em] hover:bg-brand-pink/90 transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleBanApplicant(app.applicant?._id, app.applicant?.name)}
                    disabled={actionLoading === app.applicant?._id + '-ban'}
                    className="px-4 py-2 bg-white/10 border border-white/10 text-white rounded-full text-xs font-black uppercase tracking-[0.15em] hover:bg-white/20 transition"
                  >
                    {actionLoading === app.applicant?._id + '-ban' ? 'Banning…' : 'Ban'}
                  </button>
                  <button
                    onClick={() => handleRemoveApplicant(app._id, app.applicant?.name)}
                    disabled={actionLoading === app._id + '-remove'}
                    className="px-4 py-2 bg-slate-800 text-white rounded-full text-xs font-black uppercase tracking-[0.15em] hover:bg-slate-700 transition"
                  >
                    {actionLoading === app._id + '-remove' ? 'Removing…' : 'Remove'}
                  </button>
                  {app.applicant?.email && (
                    <a
                      href={`mailto:${app.applicant.email}`}
                      className="px-4 py-2 bg-transparent border border-brand-blue text-brand-blue rounded-full text-xs font-black uppercase tracking-[0.15em] hover:bg-brand-blue/10 transition"
                    >
                      Contact
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicants;
