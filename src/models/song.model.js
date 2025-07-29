const mongoose = require('mongoose');

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
      required: [true, 'A song must have a audioUrl'],
      unique: true
    },
    duration: {
      type: Number,
      required: [true, 'A song must have a duration'],
      min: [1, 'Duration must be greater than 0']
    },
    genres: {
      type: [String],
      default: []
    },
    lyrics: {
      type: String,
      default: ''
    },
    playCount: {
      type: Number,
      default: 0
    },
    releaseDate: Date
  },
  { timestamps: true }
);

const Song = mongoose.model('Song', songSchema);
module.exports = Song;
