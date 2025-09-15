const { getAuth, clerkClient } = require('@clerk/express');
const { catchAsync } = require('../utils/helpers');
const User = require('../models/user.model');
const AppError = require('../utils/appError');

exports.optionAuth = catchAsync(async (req, res, next) => {
  const { userId } = getAuth(req);

  if (!userId) return next();

  const user = await User.findOne({ clerkId: userId });
  req.user = user;
  req.userId = userId;
  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  const { getToken, userId } = getAuth(req);

  const token = await getToken();

  if (!token)
    return next(
      new AppError('You are not logged in ! Please log in to access.', 401)
    );

  const user = await User.findOne({ clerkId: userId });
  req.user = user;
  next();
});

exports.checkRole = (...roles) => {
  return catchAsync(async (req, res, next) => {
    const {
      privateMetadata: { role }
    } = await clerkClient.users.getUser(req.user.clerkId);

    if (!roles.includes(role)) {
      return next(new AppError('Access denied', 403));
    }
    next();
  });
};
