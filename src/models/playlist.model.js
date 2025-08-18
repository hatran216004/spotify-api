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
      required: [true, 'A playlist must have a userId'],
      alias: 'user'
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    tracks: [
      {
        trackId: {
          type: mongoose.Schema.ObjectId,
          ref: 'Track',
          alias: 'track'
        },
        order: {
          type: Number,
          required: [true, 'Track need order field for reorder tracks'],
          min: 0
        },
        addedAt: {
          type: Date,
          default: Date.now
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
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.user = ret.userId;
        delete ret.userId;

        ret.tracks = ret.tracks.map((t) => {
          t.track = t.trackId;
          delete t.trackId;
          return t;
        });
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.user = ret.userId;
        delete ret.userId;

        ret.tracks = ret.tracks.map((t) => {
          t.track = t.trackId;
          delete t.trackId;
          return t;
        });
        return ret;
      }
    }
  }
);

const Playlist = mongoose.model('Playlist', playlistSchema);
module.exports = Playlist;
