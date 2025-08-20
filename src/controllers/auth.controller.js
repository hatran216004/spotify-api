const { clerkClient } = require('@clerk/express');
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

const createDefaultUserName = (email) => {
  const defaultUsername = email.match(/^([^@]*)@/);
  return defaultUsername[1];
};

exports.callbackSSO = catchAsync(async (req, res, next) => {
  const { email, imageUrl, clerkId } = req.body;

  if (!email) {
    return next(new AppError('Email is required', 400));
  }

  if (!clerkId) {
    return next(new AppError('Clerk Id is required', 400));
  }

  let username = req.body.username;

  if (!username) {
    username = createDefaultUserName(email);
    await clerkClient.users.updateUser(clerkId, { username });
  }

  let user = await User.findOne({ email });

  if (!user) {
    const data = { email, username, avatarUrl: imageUrl, clerkId };
    user = await User.create(data);
    return sendSuccess(res, { user }, 201);
  }

  sendSuccess(res, { user }, 200);
});
