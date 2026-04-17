import React from 'react';

const Footer = () => {
  return (
    <footer className="glass-card" style={{ 
      marginTop: 'auto', 
      padding: '20px', 
      textAlign: 'center',
      borderRadius: '0', /* Flat at the bottom */
      borderBottom: 'none',
      borderLeft: 'none',
      borderRight: 'none'
    }}>
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} ViceJobs Network. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;