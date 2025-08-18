const mongoose = require('mongoose');

const userFollowsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User follow need user Id'],
      alias: 'user'
    },
    artistId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Artist',
      required: [true, 'User follow need artist Id'],
      alias: 'artist'
    },
    followedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Không thể follow cùng một artist nhiều lần
userFollowsSchema.index({ userId: 1, artistId: 1 }, { unique: true });

const UserFollows = mongoose.model('UserFollows', userFollowsSchema);
module.exports = UserFollows;
