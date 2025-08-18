const { Artist, Album, Playlist, Track } = require('../models');

class SearchService {
  getSearchConfig(q) {
    return { $regex: q, $options: 'i' };
  }

  async smartSearch(q) {
    const searchConfig = this.getSearchConfig(q);

    const artists = await Artist.find({ name: searchConfig });
    if (artists.length) {
      return { result: artists, type: 'artists' };
    }

    const albums = await Album.find({ title: searchConfig });
    if (albums.length) {
      return { result: albums, type: 'albums' };
    }

    const playlists = await Playlist.find({ name: searchConfig });
    if (playlists.length) {
      return { result: playlists, type: 'playlists' };
    }

    const tracks = await Track.find({ title: searchConfig });
    if (tracks.length) {
      return { result: tracks, type: 'tracks' };
    }

    return { result: [], type: 'none' };
  }
}

module.exports = new SearchService();
