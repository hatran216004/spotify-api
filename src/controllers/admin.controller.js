const sharp = require('sharp');
const { catchAsync } = require('../utils/helpers');
const { upload } = require('../middleware/fileUpload.middleware');
const songService = require('../services/song.service');
const artistService = require('../services/artist.service');
const albumService = require('../services/album.service');

const cloudinary = require('../lib/cloudinary');
const AppError = require('../utils/appError');

const uploadToCloudinary = ({ buffer, folderToUpload }) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: folderToUpload,
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) {
            reject(new AppError('Fail to upload to cloudinary', 500));
          } else {
            resolve(result.secure_url);
          }
        }
      )
      .end(buffer);
  });
};

exports.uploadSongFiles = upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]);

exports.resizeAndUploadToCloud = catchAsync(async (req, res, next) => {
  const audio = req.files.audio[0];
  const image = req.files.image[0];

  const byteBufferArray = await sharp(image.buffer)
    .resize(500, 500)
    .toFormat('jpg')
    .jpeg({ quality: 90 })
    .toBuffer();

  const [audioUrl, imageUrl] = await Promise.all([
    uploadToCloudinary({
      buffer: audio.buffer,
      folderToUpload: 'songs/audio'
    }),
    uploadToCloudinary({
      buffer: byteBufferArray,
      folderToUpload: 'songs/images'
    })
  ]);

  req.imageUrl = imageUrl;
  req.audioUrl = audioUrl;
  next();
});

exports.createSong = catchAsync(async (req, res, next) => {
  const songData = {
    ...req.body,
    audioUrl: req.audioUrl,
    imageUrl: req.imageUrl
  };

  const song = await songService.createOne(songData);

  res.status(201).json({
    status: 'success',
    data: {
      song
    }
  });
});

exports.createArtist = catchAsync(async (req, res, next) => {
  const newArtist = await artistService.createOne(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      artist: newArtist
    }
  });
});

exports.createAlbum = catchAsync(async (req, res, next) => {
  const newAlbum = await albumService.createOne(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      album: newAlbum
    }
  });
});

// artistId: 68894250fa8065668620c19d`
// albumId: 68894480cef6cc74fe85bc11`
