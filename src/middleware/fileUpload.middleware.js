const multer = require('multer');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = async (req, file, cb) => {
  if (file.mimetype.startsWith('audio') || file.mimetype.startsWith('image'))
    cb(null, true);
  else
    cb(
      new AppError(
        'Not an image/audio! Please upload only image or audio',
        400
      ),
      false
    );
};

exports.upload = multer({ storage: multerStorage, fileFilter: multerFilter });
