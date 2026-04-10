import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  applicant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    // These must exactly match the statuses we color-coded in your React frontend
    enum: ['Pending Review', 'Interviewing', 'Offer Received', 'Rejected'], 
    default: 'Pending Review' 
  }
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);