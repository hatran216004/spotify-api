const { catchAsync } = require('../utils/helpers');

exports.protect = catchAsync((req, res, next) => {
  console.log(req.auth);
  next();
});
