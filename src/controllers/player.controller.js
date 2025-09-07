const { CONTEXT_TYPE } = require('../config/constants');
const { Track, Playlist, Album } = require('../models');
const { playerServices, artistService, userService } = require('../services');
const { sendSuccess } = require('../utils');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/helpers');

exports.getPlaybackContext = catchAsync(async (req, res, next) => {
  const { id, type } = req.params;

  if (!id) {
    return next(new AppError('Context Id is required', 400));
  }

  let tracks = [];
  let playbackContext = {
    type,
    id,
    tracks,
    totalTracks: 0
  };

  switch (type) {
    case CONTEXT_TYPE.PLAYLIST:
      const playlist = await Playlist.findById(id).populate('tracks.trackId');
      tracks = playlist.tracks.map((ele) => ele.track) || [];
      break;
    case CONTEXT_TYPE.ALBUM:
      const album = await Album.findById(id).populate('tracks');
      tracks = album.tracks;
      break;
    case CONTEXT_TYPE.ARTIST:
      tracks = await artistService.getPopularTracks(id);
      break;
    case CONTEXT_TYPE.LIKED_TRACKS:
      const likedTracks = await userService.getMeTracksLiked(req.user.id);
      tracks = likedTracks.map((ele) => ele.track);
      break;
    case CONTEXT_TYPE.QUEUE:
      break;
    case CONTEXT_TYPE.SEARCH:
      const track = await Track.findById(id);
      tracks = [track];
      break;
    default:
      break;
  }

  playbackContext.tracks = tracks;
  playbackContext.totalTracks = tracks.length;

  sendSuccess(res, { playbackContext }, 200);
});

exports.startPlayback = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const {
    trackId,
    contextType,
    contextId,
    progress = 0,
    volume,
    shuffle,
    repeatMode
  } = req.body;

  if (!trackId) {
    return next(new AppError('Track Id is required', 400));
  }

  const track = await Track.findById(trackId);

  if (!track) {
    return next(new AppError('Track not found', 404));
  }

  // Start/update playback
  await playerServices.updatePlayback(userId, trackId, {
    contextId,
    contextType,
    progress,
    isPlaying: true,
    volume,
    shuffle,
    repeatMode
  });

  const updatedPlayback = await playerServices.getCurrentPlayback(userId);
  sendSuccess(res, { updatedPlayback }, 200);
});

exports.pausePlayback = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const updatedPlayback = await playerServices.playbackControl(userId, {
    action: 'pause'
  });
  sendSuccess(res, { updatedPlayback }, 200);
});

exports.seekPlayback = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const updatedPlayback = await playerServices.playbackControl(userId, {
    action: 'seek',
    progress: req.body.progress
  });
  sendSuccess(res, { updatedPlayback }, 200);
});

exports.volumePlayback = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const updatedPlayback = await playerServices.playbackControl(userId, {
    action: 'volume',
    volume: req.body.volume
  });
  sendSuccess(res, { updatedPlayback }, 200);
});

exports.shufflePlayback = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const updatedPlayback = await playerServices.playbackControl(userId, {
    action: 'shuffle',
    shuffle: req.body.shuffle
  });
  sendSuccess(res, { updatedPlayback }, 200);
});

exports.repeatPlayback = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const updatedPlayback = await playerServices.playbackControl(userId, {
    action: 'repeat',
    repeatMode: req.body.repeatMode
  });
  sendSuccess(res, { updatedPlayback }, 200);
});

exports.getCurrentPlayback = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const currentPlayback = await playerServices.getCurrentPlayback(userId);
  if (!currentPlayback) {
    return res.status(204).send(); // No content - no active playback
  }
  sendSuccess(res, { currentPlayback }, 200);
});
