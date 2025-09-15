const Track = require('./track.model');
const Album = require('./album.model');
const Artist = require('./artist.model');
const Playlist = require('./playlist.model');
const User = require('./user.model');
const Lyric = require('./lyric.model');
const CurrentPlayback = require('./currentPlayback.model');
const UserFollows = require('./user_follows.model');
const UserLibrary = require('./userLibrary.model');

module.exports = {
  Track,
  Album,
  Artist,
  Playlist,
  User,
  Lyric,
  CurrentPlayback,
  UserFollows,
  UserLibrary
};
