const trackService = require('./track.service');
const artistService = require('./artist.service');
const albumService = require('./album.service');
const baseService = require('./base.service');
const errorService = require('./error.service');
const userService = require('./user.service');
const lyricService = require('./lyric.service');
const fileService = require('./file.service');
const statService = require('./stat.service');
const searchService = require('./search.service');
const playerServices = require('./player.service');

module.exports = {
  trackService,
  artistService,
  albumService,
  baseService,
  errorService,
  userService,
  lyricService,
  fileService,
  statService,
  searchService,
  playerServices
};
