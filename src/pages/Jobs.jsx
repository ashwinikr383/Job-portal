import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Jobs = () => {
  const navigate = useNavigate();
  const [jobListings, setJobListings] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/jobs/all');
        setJobListings(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobListings.filter(job => {
    const textMatch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());
    const locationMatch = location ? job.location?.toLowerCase().includes(location.toLowerCase()) : true;
    const typeMatch = type ? job.type?.toLowerCase().includes(type.toLowerCase()) : true;
    return textMatch && locationMatch && typeMatch;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-5xl font-black text-white mb-4 uppercase italic tracking-tighter">
          Available <span className="text-brand-pink">Gigs</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            placeholder="Search by job title or company..." 
            className="col-span-1 md:col-span-2 bg-white/10 border border-white/20 p-4 rounded-2xl text-white outline-none focus:border-brand-blue transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            className="bg-white/10 border border-white/20 p-4 rounded-2xl text-white outline-none focus:border-brand-pink transition"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="Job type (e.g. Remote, Full-Time)"
            className="bg-white/10 border border-white/20 p-4 rounded-2xl text-white outline-none focus:border-brand-blue transition"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid gap-6">
        {filteredJobs.length === 0 ? (
          <div className="glass-card p-8 text-center text-slate-400">
            No results found. Try a broader keyword, different location, or leave the filters empty.
          </div>
        ) : filteredJobs.map((job) => (
          <div key={job._id} className="glass-card p-8 flex flex-col md:flex-row justify-between items-center gap-6 border-l-8 border-l-brand-blue">
            <div className="flex-1">
              <h3 className="text-2xl font-black text-white mb-1">{job.title}</h3>
              <p className="text-brand-blue font-bold mb-4 uppercase tracking-wider text-sm">
                {job.company} • {job.location} • <span className="text-brand-pink">{job.salary}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/5 text-slate-300 px-4 py-1 rounded-full text-xs font-bold border border-white/10">
                  {job.location}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/job/${job._id}`)}
              className="bg-brand-gradient text-white px-10 py-4 rounded-2xl font-black uppercase tracking-tighter shadow-lg shadow-brand-pink/20 hover:scale-105 transition-all whitespace-nowrap"
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;