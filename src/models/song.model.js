const mongoose = require('mongoose');
const Lyric = require('./lyric.model');

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A song must have a title'],
      trim: true
    },
    imageUrl: {
      type: String,
      default: 'song-default.jpg'
    },
    artistId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Artist',
      required: [true, 'A song must have a artistId']
    },
    albumId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Album',
      required: [true, 'A song must have a albumId']
    },
    audioUrl: {
      type: String,
      required: [true, 'A song must have a audioUrl']
    },
    duration: {
      type: Number,
      required: [true, 'A song must have a duration'],
      min: [1, 'Duration must be greater than 0']
    },
    genres: {
      type: [String],
      enum: {
        values: ['pop', 'rock', 'edm', 'rap', 'ballad', 'jazz', 'lofi'],
        message:
          'Genres is either: online, pop, rock, edm, rap, ballad, jazz, lofi'
      },
      default: []
    },
    playCount: {
      type: Number,
      default: 0
    },
    releaseDate: {
      type: Date,
      default: Date.now()
    }
  },
  { timestamps: true }
);

songSchema.pre(/^find/, function (next) {
  this.populate('artistId', 'name bio avatarUrl').populate('albumId', 'title');
  next();
});

songSchema.post('findOneAndDelete', async function (doc) {
  await Lyric.findOneAndDelete({ songId: doc.id });
});

const Song = mongoose.model('Song', songSchema);
module.exports = Song;
