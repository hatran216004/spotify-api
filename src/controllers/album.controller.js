const { upload } = require('../middleware/fileUpload.middleware');
const { Album } = require('../models');
const {
  getOne,
  createOne,
  deleteOne,
  getAll,
  updateOne
} = require('./base.controller');
const fileService = require('../services/file.service');

exports.uploadAlbumCoverImg = upload.single('coverImage');

exports.resizeAndUploadAlbumImg = async (req, res, next) => {
  const file = req.file;
  if (file) {
    const byteBufferArray = await fileService.resizeImage(file);
    const coverImage = await fileService.uploadToCloudinary({
      buffer: byteBufferArray,
      folderToUpload: 'albums'
    });
    req.body.coverImage = coverImage;
  }
  next();
};

exports.getAlbum = getOne(Album, { path: 'songs', select: '-__v' });
exports.getAllAlbums = getAll(Album);
exports.createAlbum = createOne(Album);
exports.updateAlbum = updateOne(Album);
exports.deleteAlbum = deleteOne(Album);
