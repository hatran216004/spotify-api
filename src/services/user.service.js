const { PAGE_LIMIT } = require('../config/constants');
const { User, Song } = require('../models');
const ApiFeatures = require('../utils/apiFeatures');

class UserService {
  async getMeSongsLiked(userId, query) {
    const user = await User.findById(userId).populate('likedSongs');
    const likedSongIds = user.likedSongs.map((song) => song.id);

    const features = new ApiFeatures(
      Song.find({ _id: { $in: likedSongIds } }),
      query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const result = await features.query;

    const likedSongsLength = likedSongIds.length;
    const pageCount = Math.ceil(
      likedSongsLength / (+query.limit || PAGE_LIMIT)
    );

    return { likedSongs: result, pageCount, currentPage: query.page || 1 };
  }

  async addSongToLiked(userId, songId) {
    const userUpdated = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { likedSongs: songId }
      },
      { new: true }
    ).populate('likedSongs');

    const likedSong = userUpdated.likedSongs.find(
      (song) => song._id.toString() === songId
    );
    return likedSong;
  }

  async removeSongFromLiked(userId, songId) {
    await User.findByIdAndUpdate(userId, {
      $pull: { likedSongs: songId }
    });

    return null;
  }
}

module.exports = new UserService();
