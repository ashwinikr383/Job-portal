import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    salary: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Retrieve the user object saved during login
      const storedUser = JSON.parse(localStorage.getItem('user'));
      
      if (!storedUser || !storedUser._id) {
        alert("ACCESS DENIED: No authorized session found. Please log in.");
        return navigate('/login');
      }

      // 2. Prepare the payload with the 'postedBy' field required by your model
      const payload = {
        ...formData,
        postedBy: storedUser._id // Linking the job to the logged-in Employer
      };

      // 3. POST to your backend
      const response = await axios.post('http://localhost:5000/api/jobs/create', payload);

      if (response.status === 201) {
        alert("CONTRACT PUBLISHED: Data has been synced to the Syndicate.");
        setFormData({ title: '', company: '', salary: '', description: '' });
        navigate('/'); // Redirect to home or job list
      }
    } catch (err) {
      console.error("Uplink Error:", err);
      alert("DEPLOYMENT FAILED: " + (err.response?.data?.error || "Connection Timeout"));
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white placeholder-slate-500 outline-none focus:border-brand-blue transition font-medium";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="glass-card p-10 border-t-8 border-t-brand-blue bg-slate-900/50 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-black text-white uppercase italic mb-2">
          Post a <span className="text-brand-blue">Gig</span>
        </h1>
        <p className="text-slate-400 font-bold mb-8 uppercase tracking-widest text-sm">
          Recruit top-tier talent for your next operation.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-brand-pink font-black uppercase text-xs tracking-widest mb-2">Job Title</label>
            <input 
              type="text" 
              placeholder="e.g. Lead Data Heist Analyst"
              className={inputClasses}
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-brand-pink font-black uppercase text-xs tracking-widest mb-2">Company Name</label>
              <input 
                type="text" 
                placeholder="Vercetti Enterprises"
                className={inputClasses}
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-brand-pink font-black uppercase text-xs tracking-widest mb-2">Salary Range</label>
              <input 
                type="text" 
                placeholder="$100k - $150k"
                className={inputClasses}
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-brand-pink font-black uppercase text-xs tracking-widest mb-2">Mission Briefing</label>
            <textarea 
              rows="5"
              placeholder="Describe the responsibilities..."
              className={inputClasses}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-brand-gradient text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] shadow-lg hover:scale-[1.02] transition-all cursor-pointer ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'UPLOADING...' : 'Deploy Job Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;