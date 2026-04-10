import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  company: { 
    type: String, 
    required: true 
  },
  salary: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  // This is the crucial part: It links the job to the specific Employer who posted it
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);