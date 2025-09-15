const { UserLibrary, Track, Album, Playlist } = require('../models');
const AppError = require('../utils/appError');
const ApiFeatures = require('../utils/apiFeatures');

class UserLibraryService {
  async featuresQuery(query, userId, itemType, populateConfig) {
    const currentPage = +query.page || 1;
    query.limit = query.limit || 20;

    const features = new ApiFeatures(
      UserLibrary.find({ userId, itemType }),
      query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const items = await features.query.populate(populateConfig);

    const countDocs = await UserLibrary.countDocuments({ userId, itemType });
    const pageCount = Math.ceil(countDocs / +query.limit);
    return { items, currentPage, pageCount };
  }

  async getTracks(userId, query) {
    const { items, currentPage, pageCount } = await this.featuresQuery(
      query,
      userId,
      'track',
      {
        path: 'track',
        select: '-__v',
        populate: { path: 'album artists', select: 'title name' }
      }
    );

    return {
      items,
      pagination: { currentPage, pageCount }
    };
  }

  async getPlaylists(userId, query) {
    const { items, currentPage, pageCount } = await this.featuresQuery(
      query,
      userId,
      'playlist',
      {
        path: 'playlist_metadata',
        select: 'name userId isPublic coverImage description',
        populate: { path: 'user', select: 'username' }
      }
    );

    return {
      items,
      pagination: { pageCount, currentPage }
    };
  }

  async getAlbums(userId, query) {
    const { items, currentPage, pageCount } = await this.featuresQuery(
      query,
      userId,
      'album',
      { path: 'album_metadata', select: 'title coverImage' }
    );

    return {
      items,
      pagination: { pageCount, currentPage }
    };
  }

  async addTrack(userId, trackId) {
    const track = await Track.findById(trackId);

    if (!track) {
      throw new AppError(`Track not found with id: ${trackId}`, 404);
    }

    const item = await UserLibrary.create({
      userId,
      itemId: trackId,
      itemType: 'track'
    });

    return item;
  }

  async addPlaylist(userId, playlistId) {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new AppError(`Playlist not found with id: ${playlistId}`, 404);
    }

    if (!playlist.isPublic) {
      throw new AppError(`Playlist is not public`, 400);
    }

    const item = await UserLibrary.create({
      userId,
      itemId: playlistId,
      itemType: 'playlist'
    });

    return item;
  }

  async addAlbum(userId, albumId) {
    const album = await Album.findById(albumId);
    if (!album) {
      throw new AppError(`Album not found with id: ${albumId}`, 404);
    }

    const item = await UserLibrary.create({
      userId,
      itemId: albumId,
      itemType: 'album'
    });

    return item;
  }

  async removeTrack(userId, trackId) {
    await UserLibrary.deleteOne({ userId, itemId: trackId });
    return null;
  }

  async removePlaylist(userId, playlistId) {
    await UserLibrary.deleteOne({ userId, itemId: playlistId });
    return null;
  }

  async removeAlbum(userId, albumId) {
    await UserLibrary.deleteOne({ userId, itemId: albumId });
    return null;
  }
}

module.exports = new UserLibraryService();
