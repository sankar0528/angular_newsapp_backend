const mongoose = require('mongoose');

const newsItemSchema = new mongoose.Schema({
  title: { type: String, required: true }
});

module.exports = mongoose.model('NewsItem', newsItemSchema);
