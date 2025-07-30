const {
  getOne,
  createOne,
  deleteOne,
  getAll,
  updateOne
} = require('./base.controller');
const { Artist } = require('../models');

exports.getAllArtists = getAll(Artist);
exports.getArtist = getOne(Artist);
exports.createArtist = createOne(Artist);
exports.updateArtist = updateOne(Artist);
exports.deleteArtist = deleteOne(Artist);
