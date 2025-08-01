const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Artist must have a name']
    },
    bio: String,
    avatarUrl: {
      type: String,
      required: [true, 'Artist must have a avatarUrl']
    },
    coverUrl: {
      type: String,
      required: [true, 'Artist must have a avatarUrl']
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      youtube: String
    }
  },
  {
    timestamps: true
  }
);

const Artist = mongoose.model('Artist', artistSchema);
module.exports = Artist;
