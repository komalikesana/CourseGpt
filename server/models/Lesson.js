const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  concept: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  outcomes: [{ type: String }],
  concepts: [{ term: { type: String, required: true }, definition: { type: String, required: true } }],
  activities: [{ type: String }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Lesson', LessonSchema);