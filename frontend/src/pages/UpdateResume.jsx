import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateResume = () => {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (!token || !storedUser || storedUser.role !== 'Seeker') {
      alert('Please sign in as a job seeker to update your resume.');
      navigate('/login/seeker');
      return;
    }
    setUser(storedUser);
    setResumeText(storedUser.resume?.text || '');
    if (storedUser.resume?.file?.filename) {
      setUploadedFile(storedUser.resume.file);
    }
  }, [navigate]);

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      alert('Please sign in first to update your resume.');
      return navigate('/login/seeker');
    }

    setLoading(true);
    try {
      const res = await axios.patch(`http://localhost:5000/api/users/${user._id}/resume`, {
        resumeText: resumeText
      });

      const updatedUser = { ...user, resume: res.data.resume };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Resume text updated successfully!');
    } catch (err) {
      console.error('Update Resume Error:', err);
      alert(err.response?.data?.error || 'Could not update resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF and Word documents (.pdf, .doc, .docx) are allowed.');
        return;
      }
      // Check file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        return;
      }
      setResumeFile(file);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      alert('Please sign in first to upload your resume.');
      return navigate('/login/seeker');
    }

    if (!resumeFile) {
      alert('Please select a resume file to upload.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resumeFile', resumeFile);

      const res = await axios.post(`http://localhost:5000/api/users/${user._id}/resume/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updatedUser = { ...user, resume: res.data.resume };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUploadedFile(res.data.resume.file);
      setResumeFile(null);
      // Reset file input
      const fileInput = document.getElementById('resumeFileInput');
      if (fileInput) fileInput.value = '';
      alert('Resume file uploaded successfully!');
    } catch (err) {
      console.error('File Upload Error:', err);
      alert(err.response?.data?.error || 'Could not upload resume file.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async () => {
    if (!user?._id) return;

    if (!window.confirm('Are you sure you want to delete your uploaded resume file?')) {
      return;
    }

    setLoading(true);
    try {
      const res = await axios.delete(`http://localhost:5000/api/users/${user._id}/resume/file`);

      const updatedUser = { ...user, resume: res.data.resume || { text: resumeText, file: { filename: null, filepath: null, uploadDate: null, fileType: null } } };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUploadedFile(null);
      alert('Resume file deleted successfully!');
    } catch (err) {
      console.error('Delete File Error:', err);
      alert(err.response?.data?.error || 'Could not delete resume file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-white">
      <div className="glass-card p-10 border-t-8 border-t-brand-blue bg-slate-900/60 rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Update Resume</h1>
        <p className="text-slate-400 mb-8">Keep your profile sharp with the latest skills, experience, and availability.</p>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          {/* Resume Text Section */}
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-white/10">
            <h2 className="text-2xl font-bold mb-4 text-brand-blue">Resume Summary</h2>
            <form onSubmit={handleTextSubmit} className="space-y-4">
              <div>
                <label className="block text-sm uppercase tracking-[0.3em] mb-3 text-brand-pink font-black">Text Resume / Profile Summary</label>
                <textarea
                  rows="10"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-white placeholder:text-slate-500 focus:border-brand-blue outline-none transition"
                  placeholder="Summarize your skills, job goals, and recent experience..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`bg-brand-blue text-slate-900 font-black uppercase tracking-[0.2em] px-8 py-3 rounded-3xl transition-shadow hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Saving Text...' : 'Save Text Resume'}
              </button>
            </form>
          </div>

          {/* Resume File Upload Section */}
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-brand-pink">Upload Resume File</h2>
          <form onSubmit={handleFileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm uppercase tracking-[0.3em] mb-3 text-brand-pink font-black">Select File (PDF or Word)</label>
              <input
                id="resumeFileInput"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="w-full p-3 rounded-3xl border border-white/10 bg-slate-950/80 text-white cursor-pointer file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-slate-900 hover:file:shadow-[0_0_10px_rgba(59,130,246,0.4)]"
              />
              <p className="text-xs text-slate-500 mt-2">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
            </div>

            {resumeFile && (
              <div className="p-3 rounded-2xl bg-brand-blue/20 border border-brand-blue/50">
                <p className="text-sm text-white">
                  <span className="font-semibold">Selected:</span> {resumeFile.name}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !resumeFile}
              className={`bg-brand-pink text-white font-black uppercase tracking-[0.2em] px-8 py-3 rounded-3xl transition-shadow hover:shadow-[0_0_20px_rgba(255,0,51,0.4)] ${(loading || !resumeFile) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Uploading...' : 'Upload Resume File'}
            </button>
          </form>
        </div>
      </div>

        {/* Uploaded File Info */}
        {uploadedFile && uploadedFile.filename && (
          <div className="mb-10 p-6 rounded-2xl bg-slate-800/50 border border-white/10">
            <h3 className="text-lg font-bold mb-4 text-brand-blue">Current Resume File</h3>
            <div className="space-y-2 mb-4">
              <p className="text-sm"><span className="font-semibold text-brand-pink">Filename:</span> {uploadedFile.filename}</p>
              <p className="text-sm"><span className="font-semibold text-brand-pink">Upload Date:</span> {new Date(uploadedFile.uploadDate).toLocaleDateString()}</p>
              {uploadedFile.filepath && (
                <p className="text-sm">
                  <span className="font-semibold text-brand-pink">Status:</span>{' '}
                  <a 
                    href={`http://localhost:5000${uploadedFile.filepath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-blue underline hover:shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                  >
                    View File
                  </a>
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleDeleteFile}
              disabled={loading}
              className={`bg-red-600 text-white font-black uppercase tracking-[0.2em] px-6 py-2 rounded-3xl transition-shadow hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Deleting...' : 'Delete File'}
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate('/seeker-dashboard')}
            className="bg-transparent border border-white/20 text-white px-8 py-4 rounded-3xl uppercase tracking-[0.2em] hover:bg-white/5 transition font-black"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateResume;
