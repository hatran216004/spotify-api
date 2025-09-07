const { clerkClient } = require('@clerk/express');
const { User } = require('../models');
const { catchAsync, sendSuccess } = require('../utils');
const AppError = require('../utils/appError');

const createDefaultUserName = (email) => {
  const defaultUsername = email.match(/^([^@]*)@/);
  return defaultUsername[1];
};

exports.callbackSSO = catchAsync(async (req, res, next) => {
  const { email, avatarUrl, clerkId } = req.body;

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
    const data = { email, username, avatarUrl, clerkId };
    user = await User.create(data);
    return sendSuccess(res, { user }, 201);
  }

  sendSuccess(res, { user }, 200);
});
