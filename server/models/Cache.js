const mongoose = require('mongoose');

const cacheSchema = new mongoose.Schema({
  _id: String,
  count: Number
}, { timestamps: true });

cacheSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model('Cache', cacheSchema);
