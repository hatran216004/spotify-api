const mongoose = require('mongoose');
const Track = require('./track.model');
const Lyric = require('./lyric.model');

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A album must have a title']
    },
    artistId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Artist',
      required: [true, 'A album must have a artist ID']
    },
    releaseDate: Date,
    coverImage: {
      type: String,
      default: 'album-default.jpg'
    },
    genre: [String]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

albumSchema.virtual('artist', {
  ref: 'Artist',
  localField: 'artistId',
  foreignField: '_id',
  justOne: true
});

albumSchema.virtual('tracks', {
  ref: 'Track',
  foreignField: 'albumId',
  localField: '_id'
});

albumSchema.post('findOneAndDelete', async function (doc) {
  const tracks = await Track.find({ albumId: doc.id });
  const trackIds = tracks.map((track) => track.id);

  await Track.deleteMany({ albumId: doc.id });
  await Lyric.deleteMany({ trackId: { $in: trackIds } });
});

albumSchema.pre(/^find/, function (next) {
  this.populate('artist');
  next();
});

const Album = mongoose.model('Album', albumSchema);
module.exports = Album;
