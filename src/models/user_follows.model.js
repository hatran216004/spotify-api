const mongoose = require('mongoose');

const userFollowsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User follow need user Id']
    },
    artistId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Artist',
      required: [true, 'User follow need artist Id']
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

const UserFollows = mongoose.model('User_Follows', userFollowsSchema);
module.exports = UserFollows;
