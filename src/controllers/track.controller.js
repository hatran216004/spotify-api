// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const { parseBuffer } = require('music-metadata');
const { upload } = require('../middleware/fileUpload.middleware');
const { Track } = require('../models');
const { catchAsync, sendSuccess } = require('../utils');
const { deleteOne, updateOne } = require('./base.controller');
const { fromLRC } = require('../utils');
const {
  trackService,
  lyricService,
  fileService,
  userLibraryServices
} = require('../services');
const ApiFeatures = require('../utils/apiFeatures');
const { PAGE_LIMIT } = require('../config/constants');
const AppError = require('../utils/appError');

exports.uploadTrackFiles = upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'lyrics', maxCount: 1 }
]);

exports.uploadTrackAudio = catchAsync(async (req, res, next) => {
  const audio = req.files?.audio?.[0];
  if (audio) {
    const buffer = audio.buffer;
    const {
      common: { genre, title },
      format: { duration }
    } = await parseBuffer(buffer);

    const audioUrl = await fileService.uploadToCloudinary({
      buffer: buffer,
      folderToUpload: 'tracks/audio'
    });
    req.body.audioUrl = audioUrl;
    req.body.genres = genre;
    req.body.title = title;
    req.body.duration = duration;
  }
  next();
});

exports.resizeAndUploadTrackImg = catchAsync(async (req, res, next) => {
  const image = req.files?.image?.[0];
  if (image) {
    const byteBufferArray = await fileService.resizeImage(image);
    const imageUrl = await fileService.uploadToCloudinary({
      buffer: byteBufferArray,
      folderToUpload: 'tracks/images'
    });
    req.body.imageUrl = imageUrl;
  }
  next();
});

exports.parseLyricsContent = (req, res, next) => {
  const lyrics = req.files?.lyrics?.[0];
  if (lyrics) {
    const lyricsContent = lyrics.buffer.toString('utf-8').trim();
    const lrcToJSON = fromLRC(lyricsContent);
    req.body.lyrics = lrcToJSON;
  }
  next();
};

exports.createTrack = catchAsync(async (req, res, next) => {
  const track = await trackService.createOne(req.body);
  await lyricService.createTrackLyrics({
    trackId: track.id,
    content: req.body.lyrics
  });

  sendSuccess(res, { track }, 201);
});

exports.getTrendingTracks = catchAsync(async (req, res, next) => {
  const tracks = await Track.find().sort('-playCount').limit(6);
  sendSuccess(res, { tracks }, 200);
});

exports.getMadeForYouTracks = catchAsync(async (req, res, next) => {
  const tracks = await Track.aggregate([
    {
      $sample: { size: 8 }
    },
    {
      $lookup: {
        from: 'artists',
        localField: 'artists',
        foreignField: '_id',
        as: 'artists'
      }
    }
  ]);
  sendSuccess(res, { tracks }, 200);
});

exports.getAllTracks = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Track.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const data = await features.query.populate('album', 'title');
  const countDocs = await Track.countDocuments();
  const pageCount = Math.ceil(countDocs / (+req.query.limit || PAGE_LIMIT));

  sendSuccess(
    res,
    {
      tracks: data,
      pagination: { pageCount, currentPage: req.query.page || 1 }
    },
    200
  );
});
exports.getTrack = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const track = await Track.findById(id).populate('album', 'title');

  if (!track) {
    throw new AppError(`No track found with id: ${id}`, 404);
  }
  sendSuccess(res, { track }, 200);
});

exports.getMeTracksLiked = catchAsync(async (req, res, next) => {
  const { items, pagination } = await userLibraryServices.getTracks(
    req.user.id,
    req.query
  );

  sendSuccess(res, { items, pagination }, 200);
});

exports.addTrackToLiked = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const trackId = req.params.id;

  const item = await userLibraryServices.addTrack(userId, trackId);

  sendSuccess(res, { item }, 200);
});

exports.removeTrackFromLiked = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const trackId = req.params.id;

  await userLibraryServices.removeTrack(userId, trackId);

  sendSuccess(res, null, 204);
});

exports.updateTrack = updateOne(Track);
exports.deleteTrack = deleteOne(Track);
