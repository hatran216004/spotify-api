const { Track } = require('../models');
const { playerServices } = require('../services');
const { sendSuccess } = require('../utils');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/helpers');

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
