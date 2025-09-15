const { User } = require('../models');
const { sendSuccess } = require('../utils');
const { getAll, updateOne, deleteOne } = require('./base.controller');
const { upload } = require('../middleware/fileUpload.middleware');

exports.uploadFilesImg = upload.single('avatarUrl');

exports.getMe = (req, res, next) => {
  sendSuccess(res, { user: req.user }, 200);
};

exports.updateMe = updateOne(User);

exports.getAllUsers = getAll(User);
exports.deleteUser = deleteOne(User);
