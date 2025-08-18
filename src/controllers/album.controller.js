const { upload } = require('../middleware/fileUpload.middleware');
const { Album } = require('../models');
const {
  createOne,
  deleteOne,
  getAll,
  updateOne
} = require('./base.controller');
const fileService = require('../services/file.service');
const { catchAsync, sendSuccess } = require('../utils');
const AppError = require('../utils/appError');

exports.uploadAlbumCoverImg = upload.single('coverImage');

exports.resizeAndUploadAlbumImg = async (req, res, next) => {
  const file = req.file;
  if (file) {
    const byteBufferArray = await fileService.resizeImage(file, 2000, 1333);
    const coverImage = await fileService.uploadToCloudinary({
      buffer: byteBufferArray,
      folderToUpload: 'albums'
    });
    req.body.coverImage = coverImage;
  }
  next();
};

exports.getPopularAlbums = catchAsync(async (req, res, next) => {
  let albums = await Album.aggregate([
    {
      $sample: { size: 6 }
    }
  ]);

  albums = await Album.populate(albums, {
    path: 'artistId',
    select: 'name avatarUrl'
  });

  albums = albums.map((album) => {
    album.artist = album.artistId;
    delete album.artistId;
    return album;
  });

  sendSuccess(res, { albums }, 200);
});

exports.getAlbum = catchAsync(async (req, res, next) => {
  const { id: albumId } = req.params;

  if (!albumId) {
    return next(new AppError('Album Id is required', 400));
  }

  const album = await Album.findById(albumId)
    .populate('tracks')
    .populate('artistId');
  if (!album) {
    return next(new AppError(`No Album found with Id: ${albumId}`, 404));
  }
  sendSuccess(res, { album }, 200);
});
exports.getAllAlbums = getAll(Album);
exports.createAlbum = createOne(Album);
exports.updateAlbum = updateOne(Album);
exports.deleteAlbum = deleteOne(Album);
