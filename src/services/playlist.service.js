const { Playlist } = require('../models');
const AppError = require('../utils/appError');

class PlaylistService {
  async reorderPlaylist(playlistId, reorderData) {
    const { fromIndex, toIndex, songId } = reorderData;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist)
      throw new AppError(
        `No document found with playlid id: ${playlistId}`,
        404
      );

    const playlistLength = playlist.songs.length;
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= playlistLength ||
      toIndex >= playlistLength
    ) {
      throw new AppError('Invalid indices', 400);
    }

    const songToMove = playlist.songs.find(
      (s) => s.songId.toString() === songId && s.order === fromIndex
    );

    if (!songToMove) {
      throw new AppError('Song not found at specified position', 400);
    }

    const { songs } = playlist;
    const [movedSong] = songs.splice(fromIndex, 1);
    songs.splice(toIndex, 0, movedSong);

    songs.forEach((song, index) => ({ ...song, order: index }));
    const result = await playlist.save();

    return result;
  }
}

module.exports = new PlaylistService();
