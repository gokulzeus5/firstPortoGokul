const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  professionalTitle: {
    type: String,
    required: true,
    default: 'Web Developer & Designer'
  },
  bio: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: '/images/default-profile.jpg'
  },
  skills: [{
    name: String,
    proficiency: {
      type: Number,
      min: 1,
      max: 10
    }
  }],
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    instagram: String
  },
  stats: {
    projectsCompleted: {
      type: Number,
      default: 0
    },
    happyClients: {
      type: Number,
      default: 0
    },
    yearsExperience: {
      type: Number,
      default: 0
    },
    awardsReceived: {
      type: Number,
      default: 0
    }
  },
  availableForFreelance: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});



module.exports = mongoose.model('User', userSchema);
