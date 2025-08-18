/* eslint-disable no-case-declarations */
const {
  CurrentPlayback,
  Track,
  Album,
  Playlist,
  Artist
} = require('../models');
const AppError = require('../utils/appError');

class PlayerServices {
  async updatePlayback(userId, trackId, options) {
    const existing = await CurrentPlayback.findOne({ userId });

    const playbackData = {
      trackId,
      contextId: options.contextId || null,
      contextType: options.contextType || null,
      progress: options.progress ?? 0,
      isPlaying: options.isPlaying || true,
      volume: options.volume ?? 80,
      shuffle: options.shuffle || false,
      repeatMode: options.repeatMode || 'off'
    };

    if (existing) {
      const playbackUpdated = await CurrentPlayback.findOneAndUpdate(
        { userId },
        playbackData,
        { new: true }
      );
      return playbackUpdated;
    }

    const newPlayback = await CurrentPlayback.create({
      userId,
      ...playbackData
    });

    return newPlayback;
  }

  async playbackControl(userId, controls) {
    const currentPlayback = await this.getCurrentPlayback(userId);

    if (!currentPlayback) {
      throw new AppError('No active playback session', 404);
    }

    const updates = {};
    switch (controls.action) {
      case 'play':
        updates.isPlaying = true;
        break;
      case 'pause':
        updates.isPlaying = false;
        break;
      case 'seek':
        if (controls.progress) {
          updates.progress = Math.max(0, Math.min(100, controls.progress));
        }
        break;
      case 'shuffle':
        if (controls.shuffle) {
          updates.shuffle = controls.shuffle;
        }
        break;
      case 'volume':
        if (controls.volume) {
          updates.volume = Math.max(0, Math.min(100, controls.volume));
        }
        break;
      case 'repeat':
        if (controls.repeat) {
          updates.repeatMode = controls.repeatMode;
        }
        break;
      default:
        break;
    }
    await CurrentPlayback.findOneAndUpdate({ userId }, updates);
    return this.getCurrentPlayback(userId);
  }

  async getCurrentPlayback(userId) {
    const playback = await CurrentPlayback.findOne({ userId }).lean();

    if (!playback) return null;

    const trackDetail = await Track.findById(playback.trackId)
      .populate('artists', 'name avatarUrl')
      .populate('albumId', 'title coverImage');

    if (!trackDetail) return null;

    let context;

    switch (playback.contextType) {
      case 'album':
        const [album, totalTracks] = await Promise.all([
          Album.findById(playback.contextId),
          Track.countDocuments({ albumId: playback.contextId })
        ]);
        if (album) {
          context = {
            name: album.title,
            imageUrl: album.coverImage,
            totalTracks
          };
        }
        break;
      case 'playlist':
        const playlist = await Playlist.findById(playback.contextId);
        context = {
          name: playlist.name,
          imageUrl: playlist.coverImage,
          totalTracks: playlist.tracks.length
        };
        break;

      case 'artist':
        const artist = await Artist.findById(playlist.contextId);
        context = {
          name: artist.name,
          imageUrl: artist.avatarUrl
        };
        break;
      default:
        break;
    }
    return { ...playback, track: trackDetail, context };
  }
}

module.exports = new PlayerServices();
