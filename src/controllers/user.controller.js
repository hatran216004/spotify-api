const { catchAsync } = require('../utils/helpers');

exports.getAllusers = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: null
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: null
  });
});
