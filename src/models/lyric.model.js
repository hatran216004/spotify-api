const mongoose = require('mongoose');

const lyricSchema = new mongoose.Schema({
  songId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Song',
    required: [true, 'Lyrics should belong to the song'],
    unique: true
  },
  content: {
    type: [
      {
        time: Number,
        line: String
      }
    ],
    default: []
  }
});

const Lyric = mongoose.model('Lyric', lyricSchema);
module.exports = Lyric;
