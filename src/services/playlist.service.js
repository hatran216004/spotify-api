const { PAGE_LIMIT } = require('../config/constants');
const { Playlist, Track } = require('../models');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

class PlaylistService {
  async getMyPlaylists(userId, query) {
    const features = new ApiFeatures(Playlist.find({ userId }), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const playlists = await features.query.populate('userId', 'username');
    const countDocs = await Playlist.countDocuments();
    const pageCount = Math.ceil(countDocs / (+query.limit || PAGE_LIMIT));

    return {
      playlists,
      pagination: { pageCount, currentPage: query.page || 1 }
    };
  }

  async addTrackToPlaylist(playlistId, trackId) {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist)
      throw new AppError(`No playlist found with id: ${playlistId}`, 404);

    const track = await Track.findById(trackId);

    if (!track) throw new AppError(`No track found with id: ${trackId}`, 404);

    const alreadyExists = playlist.tracks.some(
      (entry) => entry.track._id.toString() === trackId.toString()
    );
    if (alreadyExists) {
      throw new AppError(`Track already exists in playlist`, 400);
    }

    playlist.tracks.unshift({ trackId, order: 0 });
    const playlistUpdated = await this.updatePlaylistMetadata(playlist);

    return playlistUpdated;
  }

  async removeTrackFromPlaylist(playlistId, trackId) {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist)
      throw new AppError(`No playlist found with id: ${playlistId}`, 404);

    const trackIndex = playlist.tracks.findIndex(
      (entry) => entry.track._id.toString() === trackId
    );

    if (trackIndex === -1)
      throw new AppError(`No track found with id: ${trackId}`, 404);

    playlist.tracks.splice(trackIndex, 1);
    const playlistUpdated = await this.updatePlaylistMetadata(playlist);

    return playlistUpdated;
  }

  async updatePlaylistMetadata(playlist) {
    // Sắp xếp lại order
    const tracks = playlist.tracks.map((ele, index) => ({
      ...ele.toObject(),
      order: index
    }));

    // Tính toán lại totalDuration
    const playlistWithPopulate = await playlist.populate(
      'tracks.trackId',
      'duration'
    );

    const totalDuration = playlistWithPopulate.tracks.reduce(
      (sum, entry) => sum + (entry.track?.duration || 0),
      0
    );

    const playlistUpdated = await Playlist.findByIdAndUpdate(
      playlist._id,
      { tracks, totalDuration },
      { new: true }
    ).populate('tracks.trackId');

    return playlistUpdated;
  }

  async createOne(userId) {
    const playlistCount = await Playlist.countDocuments({
      userId
    });
    const name = `My Playlist #${playlistCount + 1}`;
    const data = {
      name,
      userId
    };
    const playlist = await Playlist.create(data);
    return playlist;
  }

  async reorderPlaylist(playlistId, reorderData) {
    const { fromIndex, toIndex, trackId } = reorderData;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist)
      throw new AppError(
        `No document found with playlid id: ${playlistId}`,
        404
      );

    const playlistLength = playlist.tracks.length;
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= playlistLength ||
      toIndex >= playlistLength
    ) {
      throw new AppError('Invalid indices', 400);
    }

    const trackToMove = playlist.tracks.find(
      (s) => s.track._id.toString() === trackId && s.order === fromIndex
    );

    if (!trackToMove) {
      throw new AppError('Track not found at specified position', 400);
    }

    const { tracks } = playlist;
    const [movedTrack] = tracks.splice(fromIndex, 1);
    tracks.splice(toIndex, 0, movedTrack);

    tracks.forEach((track, index) => {
      track.order = index;
    });

    const result = await playlist.save();

    return result;
  }
}

module.exports = new PlaylistService();
