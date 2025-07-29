const Album = require('../models/album.model');

class AlbumService {
  async createOne(data) {
    const newAlbum = await Album.create(data);
    return newAlbum;
  }
}

module.exports = new AlbumService();
