const Artist = require('../models/artist.model');

class ArtistService {
  createOne(data) {
    const newArtist = Artist.create(data);
    return newArtist;
  }
}

module.exports = new ArtistService();
