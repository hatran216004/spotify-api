const { upload } = require('../middleware/fileUpload.middleware');
const { Song } = require('../models');
const { catchAsync, sendSuccess } = require('../utils');
const { getOne, deleteOne, getAll, updateOne } = require('./base.controller');
const { fromLRC } = require('../utils');
const { songService, lyricService } = require('../services');
const fileService = require('../services/file.service');

exports.uploadSongFiles = upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'lyrics', maxCount: 1 }
]);

exports.uploadSongAudio = catchAsync(async (req, res, next) => {
  const audio = req.files.audio?.[0];
  if (audio) {
    const audioUrl = await fileService.uploadToCloudinary({
      buffer: audio.buffer,
      folderToUpload: 'songs/audio'
    });
    req.body.audioUrl = audioUrl;
  }
  next();
});

exports.resizeAndUploadSongImg = catchAsync(async (req, res, next) => {
  const image = req.files.image?.[0];

  if (image) {
    const byteBufferArray = await fileService.resizeImage(image);
    const imageUrl = await fileService.uploadToCloudinary({
      buffer: byteBufferArray,
      folderToUpload: 'songs/images'
    });
    req.body.imageUrl = imageUrl;
  }
  next();
});

exports.parseLyricsContent = (req, res, next) => {
  const lyrics = req.files.lyrics?.[0];
  if (lyrics) {
    const lyricsContent = lyrics.buffer.toString('utf-8').trim();
    const lrcToJSON = fromLRC(lyricsContent);
    req.body.lyrics = lrcToJSON;
  }
  next();
};

exports.createSong = catchAsync(async (req, res, next) => {
  const song = await songService.createOne(req.body);
  await lyricService.createSongLyrics({
    songId: song.id,
    content: req.body.lyrics
  });
  sendSuccess(res, { song }, 201);
});

exports.getAllSongs = getAll(Song);
exports.getSong = getOne(Song);
exports.updateSong = updateOne(Song);
exports.deleteSong = deleteOne(Song);
