const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', default: [] }],
  metadata: {
    prerequisites: [{ type: String, default: [] }],
    difficulty: { type: String, default: 'Beginner' },
    estimatedTime: { type: String, default: '1 hour' },
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Module', ModuleSchema);