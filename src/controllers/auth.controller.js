const { User } = require('../models');
const { catchAsync, sendSuccess } = require('../utils');
const AppError = require('../utils/appError');

exports.callbackRegister = catchAsync(async (req, res, next) => {
  const { email, username, clerkId } = req.body;

  if (!clerkId || !email || !username) {
    return next(new AppError('Missing /email/username', 400));
  }

  const user = await User.create({ email, username, clerkId });
  sendSuccess(res, { user }, 201);
});

exports.callbackLogin = catchAsync(async (req, res, next) => {
  const { email, username } = req.body;

  if (!email && !username) {
    return next(new AppError('Missing email or username', 400));
  }

  let user = null;
  if (email) {
    user = await User.findOne({ email });
  }

  if (username) {
    user = await User.findOne({ username });
  }

  sendSuccess(res, { user }, 200);
});
