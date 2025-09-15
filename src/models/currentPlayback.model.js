const mongoose = require('mongoose');

const currentPlaybackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'userId is required'],
      ref: 'User'
    },
    trackId: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'trackId is required'],
      ref: 'Track'
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    isPlaying: {
      type: Boolean,
      default: false
    },
    volume: {
      type: Number,
      default: 70,
      min: 0,
      max: 100
    },
    shuffle: {
      type: Boolean,
      default: false
    },
    repeatMode: {
      type: String,
      enum: ['off', 'track', 'context'],
      default: 'off'
    },
    playlistId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Playlist',
      default: null
    },
    contextType: {
      type: String,
      enum: ['album', 'playlist', 'artist', 'search'],
      default: null
    },
    contextId: {
      type: mongoose.Schema.ObjectId,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const CurrentPlayback = mongoose.model(
  'Current_Playback',
  currentPlaybackSchema
);

module.exports = CurrentPlayback;
