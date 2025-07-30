const multer = require('multer');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = async (req, file, cb) => {
  const isAudio = file.mimetype.startsWith('audio');
  const isImage = file.mimetype.startsWith('image');
  const isLRC = file.originalname.endsWith('.lrc');
  if (isAudio || isImage || isLRC) cb(null, true);
  else
    cb(
      new AppError(
        'Not an image/audio! Please upload only image/audio/lrc',
        400
      ),
      false
    );
};

exports.upload = multer({ storage: multerStorage, fileFilter: multerFilter });
