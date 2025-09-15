const mongoose = require('mongoose');

const lyricSchema = new mongoose.Schema(
  {
    trackId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Track',
      required: [true, 'Lyrics should belong to the track'],
      unique: true
    },
    content: {
      type: [
        {
          time: Number,
          line: String
        }
      ],
      default: []
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.track = ret.trackId; // copy sang field track
        delete ret.trackId; // xóa field gốc
        return ret; // ✅ BẮT BUỘC phải return ret
      }
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.track = ret.trackId;
        delete ret.trackId;
        return ret;
      }
    }
  }
);

const Lyric = mongoose.model('Lyric', lyricSchema);
module.exports = Lyric;
