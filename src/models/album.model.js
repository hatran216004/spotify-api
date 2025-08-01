const mongoose = require('mongoose');
const Song = require('./song.model');
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
      required: [true, 'A album must have a artistId']
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

albumSchema.virtual('songs', {
  ref: 'Song',
  foreignField: 'albumId',
  localField: '_id'
});

albumSchema.post('findOneAndDelete', async function (doc) {
  const songs = await Song.find({ albumId: doc.id });
  const songIds = songs.map((song) => song.id);

  await Song.deleteMany({ albumId: doc.id });
  await Lyric.deleteMany({ songId: { $in: songIds } });
});

const Album = mongoose.model('Album', albumSchema);
module.exports = Album;
