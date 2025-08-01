const {
  getOne,
  createOne,
  deleteOne,
  getAll,
  updateOne
} = require('./base.controller');
const { Artist } = require('../models');
const { catchAsync } = require('../utils');
const { upload } = require('../middleware/fileUpload.middleware');
const { fileService } = require('../services');

exports.uploadFilesImg = upload.fields([
  { name: 'coverUrl', maxCount: 1 },
  { name: 'avatarUrl', maxCount: 1 }
]);

exports.resizeAndUploadImg = catchAsync(async (req, res, next) => {
  const coverImgFile = req.files?.coverUrl?.[0];
  const avatarImgFile = req.files?.avatarUrl?.[0];

  if (coverImgFile) {
    const buffer = await fileService.resizeImage(coverImgFile);
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

exports.getAllArtists = getAll(Artist);
exports.getArtist = getOne(Artist);
exports.createArtist = createOne(Artist);
exports.updateArtist = updateOne(Artist);
exports.deleteArtist = deleteOne(Artist);
