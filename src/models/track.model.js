const mongoose = require('mongoose');
const Lyric = require('./lyric.model');

const trackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A track must have a title'],
      trim: true
    },
    imageUrl: {
      type: String,
      default: 'track-default.jpg'
    },
    artists: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Artist',
        required: [true, 'A track must have a artist']
      }
    ],
    albumId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Album',
      required: [true, 'A track must have a albumId'],
      alias: 'album'
    },
    audioUrl: {
      type: String,
      required: [true, 'A track must have a audioUrl']
    },
    duration: {
      type: Number,
      required: [true, 'A track must have a duration'],
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
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.album = ret.albumId;
        delete ret.albumId;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.album = ret.albumId;
        delete ret.albumId;
        return ret;
      }
    }
  }
);

trackSchema.pre(/^find/, function (next) {
  this.populate('artists');
  next();
});

trackSchema.post('findOneAndDelete', async function (doc) {
  await Lyric.findOneAndDelete({ trackId: doc.id });
});

const Track = mongoose.model('Track', trackSchema);
module.exports = Track;
