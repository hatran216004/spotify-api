const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A playlist must have a name']
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A playlist must have a userId']
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    songs: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Song'
    },
    totalDuration: {
      type: Number,
      default: 0
    },
    coverImage: String,
    description: String
  },
  {
    timestamps: true
  }
);

const Playlist = mongoose.model('Playlist', playlistSchema);
module.exports = Playlist;
