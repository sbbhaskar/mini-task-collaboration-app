// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  deadline: {
    type: Date,
    required: true,
  },

  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  },

  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending',
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
