const {
  createOne,
  deleteOne,
  getAll,
  updateOne
} = require('./base.controller');
const { Artist, UserFollows } = require('../models');
const { catchAsync, sendSuccess } = require('../utils');
const { upload } = require('../middleware/fileUpload.middleware');
const { fileService, artistService } = require('../services');
const AppError = require('../utils/appError');

exports.uploadFilesImg = upload.fields([
  { name: 'coverUrl', maxCount: 1 },
  { name: 'avatarUrl', maxCount: 1 }
]);

exports.resizeAndUploadImg = catchAsync(async (req, res, next) => {
  const coverImgFile = req.files?.coverUrl?.[0];
  const avatarImgFile = req.files?.avatarUrl?.[0];

  if (coverImgFile) {
    const buffer = await fileService.resizeImage(coverImgFile, 2000, 1333);
    const coverUrl = await fileService.uploadToCloudinary({
      buffer,
      folderToUpload: 'users'
    });
    req.body.coverUrl = coverUrl;
  }

  if (avatarImgFile) {
    const buffer = await fileService.resizeImage(avatarImgFile);
    const avatarUrl = await fileService.uploadToCloudinary({
      buffer,
      folderToUpload: 'users'
    });
    req.body.avatarUrl = avatarUrl;
  }
  next();
});

exports.getPopularArtists = catchAsync(async (req, res, next) => {
  const artists = await Artist.aggregate([
    {
      $sample: { size: 8 }
    }
  ]);

  sendSuccess(res, { artists }, 200);
});

exports.getArtistPopularTracks = catchAsync(async (req, res, next) => {
  const { id: artistId } = req.params;
  const tracks = await artistService.getPopularTracks(artistId);

  sendSuccess(res, { tracks }, 200);
});

exports.getFollowedArtists = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const userFollows = await UserFollows.find({ userId })
    .select('artistId')
    .populate('artistId');

  const artistFollows = userFollows.map((entry) => entry.artistId);

  sendSuccess(res, { artistFollows }, 200);
});

exports.followArtist = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { id: artistId } = req.params;

  if (!artistId) {
    return next(new AppError('Artist id is required', 400));
  }

  const existing = await UserFollows.findOne({ userId, artistId });
  let data = {
    artistId,
    userId,
    isFollowed: true
  };

  if (existing) {
    data = {
      ...data,
      followedAt: existing.followedAt,
      status: 'already_followed'
    };
    return sendSuccess(res, data, 200);
  }

  const result = await UserFollows.create({ artistId, userId });
  data = { ...data, followedAt: result.followedAt, status: 'new_follow' };
  sendSuccess(res, data, 201);
});

exports.unFollowArtist = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { id: artistId } = req.params;

  if (!artistId) {
    return next(new AppError('Artist id is required', 400));
  }

  let data = {
    artistId,
    userId,
    isFollowed: false
  };

  const existing = await UserFollows.findOne({ userId, artistId });
  // User này CHƯA follow artist đó
  if (!existing) {
    data = { ...data, status: 'already_unfollowed' };
    return sendSuccess(res, data, 200);
  }

  await UserFollows.deleteOne({ userId, artistId });
  data = { ...data, status: 'unfollowed' };
  sendSuccess(res, data, 204);
});

exports.getArtist = catchAsync(async (req, res, next) => {
  const { id: artistId } = req.params;
  const userId = req.user.id;

  if (!artistId) {
    return next(new AppError('Artist Id is required', 400));
  }

  let artist = await Artist.findById(artistId).lean();

  const userFollowed = await UserFollows.findOne({ userId, artistId }).select(
    'followedAt'
  );

  if (userFollowed) {
    artist = {
      ...artist,
      isFollowed: true,
      followedAt: userFollowed.followedAt
    };
  } else {
    artist = { ...artist, isFollowed: false };
  }
  sendSuccess(res, { artist }, 200);
});

exports.getAllArtists = getAll(Artist);
exports.createArtist = createOne(Artist);
exports.updateArtist = updateOne(Artist);
exports.deleteArtist = deleteOne(Artist);
