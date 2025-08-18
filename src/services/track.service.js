const Track = require('../models/track.model');

class TrackService {
  async createOne(data) {
    const track = await Track.create(data);

    return track;
  }

  async getAll() {
    return [];
  }

  deleteOne() {
    //
  }

  updateOne() {
    //
  }
}

module.exports = new TrackService();
