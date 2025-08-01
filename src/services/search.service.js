const { Artist, Album, Playlist, Song } = require('../models');

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

    const songs = await Song.find({ title: searchConfig });
    if (songs.length) {
      return { result: songs, type: 'songs' };
    }

    return { result: [], type: 'none' };
  }
}

module.exports = new SearchService();
