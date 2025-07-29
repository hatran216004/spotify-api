const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'A user must have a email'],
      unique: true,
      lowercase: true,
      validate: {
        validator: isEmail,
        message: 'Invalid email address'
      }
    },
    username: {
      type: String,
      required: [true, 'A user must have a username'],
      unique: true
    },
    likedSongs: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Song',
      default: []
    },
    following: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Artist',
      default: []
    },
    avatarUrl: {
      type: String,
      default: 'user-default.jpg'
    },
    clerkId: {
      type: String,
      required: [true, 'A user must have a clerkId'],
      unique: true
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
