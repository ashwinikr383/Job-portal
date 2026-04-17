import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BannedUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(null);

  useEffect(() => {
    const fetchBannedUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/banned');
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to load banned users:', err);
        alert('Unable to load banned users. Please login as admin and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBannedUsers();
  }, []);

  const handleRestore = async (id, name) => {
    if (!window.confirm(`Restore ${name} to active status?`)) return;

    setRestoring(id);
    try {
      const res = await axios.patch(`http://localhost:5000/api/users/${id}/status`, { status: 'Active' });
      setUsers(users.filter((user) => user._id !== id));
      alert(`${name} has been restored.`);
    } catch (err) {
      console.error('Restore failed:', err);
      alert(err.response?.data?.error || 'Could not restore the user.');
    } finally {
      setRestoring(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-white min-h-screen">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-5xl font-black uppercase tracking-tighter">Banned <span className="text-brand-pink">Operatives</span></h2>
          <p className="text-slate-400 mt-3">Restore users who were previously banned from the network.</p>
        </div>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="bg-white/10 text-white px-6 py-3 rounded-3xl font-black uppercase tracking-[0.2em] border border-white/10 hover:bg-white/20 transition"
        >
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <div className="glass-card p-10 border border-white/10 bg-slate-950/70 text-slate-400 text-center">
          Loading banned operatives...
        </div>
      ) : users.length === 0 ? (
        <div className="glass-card p-10 border border-white/10 bg-slate-950/70 text-slate-400 text-center">
          There are no banned operatives at this time.
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user._id} className="glass-card p-6 bg-slate-950/70 border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-white">{user.name}</h3>
                <p className="text-slate-400 text-sm uppercase tracking-[0.2em]">{user.role || 'Unknown Role'}</p>
                <p className="text-slate-500 text-sm mt-2">{user.email}</p>
              </div>
              <button
                onClick={() => handleRestore(user._id, user.name)}
                disabled={restoring === user._id}
                className="px-5 py-3 bg-brand-blue text-slate-900 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-brand-blue/90 transition"
              >
                {restoring === user._id ? 'Restoring...' : 'Restore User'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannedUsers;
