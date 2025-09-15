const mongoose = require('mongoose');

const userLibrarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A user library must have a user ID']
    },
    itemType: {
      type: String,
      required: [true, 'Item type is required'],
      enum: {
        values: ['track', 'album', 'playlist'],
        message: 'Item type must be playlist, track, album'
      }
    },
    itemId: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Item ID is required']
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Chống trùng lặp: đảm bảo một user không thể lưu cùng 1 item 2 lần
userLibrarySchema.index(
  { userId: 1, itemType: 1, itemId: 1 },
  { unique: true }
);

// Hỗ trợ infinite scroll/pagination theo từng tab (Track, Album, Playlist)
userLibrarySchema.index({
  userId: 1,
  itemType: 1,
  addedAt: -1,
  _id: 1
});

// Dùng khi hiển thị toàn bộ thư viện không phân loại (giống Spotify tab “Your Library → All”)
userLibrarySchema.index({
  userId: 1,
  addedAt: -1,
  _id: -1
});

userLibrarySchema.virtual('track', {
  ref: 'Track',
  foreignField: '_id',
  localField: 'itemId',
  justOne: true
});

userLibrarySchema.virtual('album_metadata', {
  ref: 'Album',
  foreignField: '_id',
  localField: 'itemId',
  justOne: true
});

userLibrarySchema.virtual('playlist_metadata', {
  ref: 'Playlist',
  foreignField: '_id',
  localField: 'itemId',
  justOne: true
});

const UserLibrary = mongoose.model('User_Library', userLibrarySchema);
module.exports = UserLibrary;
/*
  - userLibrarySchema.statics: gọi trực tiếp trên model
  - userLibrarySchema.methods: gọi trực tiếp trên document
*/
