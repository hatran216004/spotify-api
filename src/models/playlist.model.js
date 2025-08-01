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
    songs: [
      {
        songId: {
          type: mongoose.Schema.ObjectId,
          ref: 'Song'
        },
        order: {
          type: Number,
          required: [true, 'Song need order field for drag and drop'],
          min: 0
        }
      }
    ],
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

playlistSchema.pre(/^find/, function (next) {
  this.populate('songs');
  next();
});

const Playlist = mongoose.model('Playlist', playlistSchema);
module.exports = Playlist;
