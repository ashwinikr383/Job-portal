import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['Seeker', 'Employer', 'Admin'], 
    required: true
  },
  // Employer Specific Field (Seekers won't need this)
  companyName: { 
    type: String 
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  status: { 
    type: String, 
    enum: ['Active', 'Banned', 'Pending', 'Verified'], 
    default: 'Pending' 
  },
  resume: {
    text: {
      type: String,
      default: ''
    },
    file: {
      filename: {
        type: String,
        default: null
      },
      filepath: {
        type: String,
        default: null
      },
      uploadDate: {
        type: Date,
        default: null
      },
      fileType: {
        type: String,
        default: null
      }
    }
  },
  // Admin Control Fields (So your admin dashboard can ban users)
  status: { 
    type: String, 
    enum: ['Active', 'Banned', 'Pending', 'Verified'], 
    default: 'Active' 
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);