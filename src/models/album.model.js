const mongoose = require('mongoose');

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
      required: [true, 'A album must have a artistId']
    },
    genre: [String]
  },
  {
    timestamps: true
  }
);

const Album = mongoose.model('Album', albumSchema);
module.exports = Album;
