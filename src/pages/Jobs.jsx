import React from 'react';

const Jobs = () => {
  const jobListings = [
    {
      id: 1,
      role: 'Senior React Developer',
      company: 'Neon Tech Solutions',
      location: 'Remote',
      salary: '$120k - $150k',
      tags: ['React', 'Vite', 'Frontend']
    },
    {
      id: 2,
      role: 'Cybersecurity Analyst',
      company: 'Vice City Corp',
      location: 'Miami, FL',
      salary: '$90k - $110k',
      tags: ['Security', 'Network', 'Crypto']
    },
    {
      id: 3,
      role: 'AI Prompt Engineer',
      company: 'Synth Wave AI',
      location: 'Remote',
      salary: '$100k - $130k',
      tags: ['LLM', 'Python', 'AI']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-5xl font-black text-white mb-4 uppercase italic tracking-tighter">
          Available <span className="text-brand-pink">Gigs</span>
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Search by job title or company..." 
            className="flex-1 bg-white/10 border border-white/20 p-4 rounded-2xl text-white outline-none focus:border-brand-blue transition"
          />
          <button className="bg-brand-blue text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition">
            Filter
          </button>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid gap-6">
        {jobListings.map((job) => (
          <div key={job.id} className="glass-card p-8 flex flex-col md:flex-row justify-between items-center gap-6 border-l-8 border-l-brand-blue">
            <div className="flex-1">
              <h3 className="text-2xl font-black text-white mb-1">{job.role}</h3>
              <p className="text-brand-blue font-bold mb-4 uppercase tracking-wider text-sm">
                {job.company} • {job.location} • <span className="text-brand-pink">{job.salary}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {job.tags.map(tag => (
                  <span key={tag} className="bg-white/5 text-slate-300 px-4 py-1 rounded-full text-xs font-bold border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button className="bg-brand-gradient text-white px-10 py-4 rounded-2xl font-black uppercase tracking-tighter shadow-lg shadow-brand-pink/20 hover:scale-105 transition-all whitespace-nowrap">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;