const { User } = require('../models');
const AppError = require('../utils/appError');

class UserService {
  async getMeTracksLiked(userId) {
    const user = await User.findById(userId).populate('likedTracks.trackId');
    user.likedTracks.sort((a, b) => b.addedAt - a.addedAt);

    const likedTracks = user.likedTracks.map((entry) => ({
      track: entry.trackId,
      addedAt: entry.addedAt
    }));

    return likedTracks;
  }

  async addTrackToLiked(userId, trackId) {
    const existing = await User.findOne({
      _id: userId,
      'likedTracks.trackId': trackId
    });

    if (existing) {
      throw new AppError('Track existing in liked songs', 400);
    }

    const userUpdated = await User.findByIdAndUpdate(
      userId,
      {
        $push: { likedTracks: { trackId } }
      },
      { new: true }
    ).populate('likedTracks.trackId');

    const likedTracks = userUpdated.likedTracks.find(
      (entry) => entry.trackId._id.toString() === trackId
    );
    return likedTracks;
  }

  async removeTrackFromLiked(userId, trackId) {
    await User.findByIdAndUpdate(userId, {
      $pull: { likedTracks: { trackId } }
    });

    return null;
  }
}

module.exports = new UserService();
