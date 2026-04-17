import React from 'react';
import { Link } from 'react-router-dom';

const LoginSelection = () => {
  const accountTypes = [
    {
      title: "Job Seeker",
      description: "Find high-paying gigs and build your career.",
      path: "/login/seeker",
      color: "border-brand-blue",
      icon: "👤"
    },
    {
      title: "Employer",
      description: "Post jobs and recruit top-tier talent.",
      path: "/employer-login",
      color: "border-brand-pink",
      icon: "💼"
    },
    {
      title: "Admin",
      description: "System control and moderation center.",
      path: "/admin",
      color: "border-brand-purple",
      icon: "🛡️"
    }
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      {/* Heading Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 mb-2">Welcome to NEEDSYOU</h2>
        <p className="text-slate-500 font-medium">Select your account type to continue.</p>
      </div>

      {/* Selection Cards Grid */}
      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
        {accountTypes.map((type) => (
          <Link 
            key={type.title}
            to={type.path}
            className={`bg-white p-8 rounded-3xl border-2 ${type.color} shadow-xl hover:scale-105 transition-all duration-300 flex flex-col items-center text-center group`}
          >
            <div className="text-5xl mb-6 group-hover:animate-bounce">{type.icon}</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">{type.title}</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              {type.description}
            </p>
            <span className="mt-auto font-bold text-sm uppercase tracking-widest text-slate-400 group-hover:text-brand-pink transition-colors">
              Enter Portal →
            </span>
          </Link>
        ))}
      </div>
      
      {/* Small branding footer for the page as seen in report */}
      <p className="mt-16 text-slate-300 font-bold tracking-widest text-xs uppercase">
        NEEDSYOU Secure Access Protocol
      </p>
    </div>
  );
};

export default LoginSelection;