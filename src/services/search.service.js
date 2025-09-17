/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const redisClient = require('../lib/redis');
const { Artist, Album, Playlist, Track } = require('../models');

class SearchService {
  constructor() {
    // Cache configuration
    this.cacheConfig = {
      ttl: 300, // 5 minutes
      prefix: 'search:'
    };

    // Search priorities và models mapping
    this.searchModels = [
      { model: Artist, field: 'name', type: 'artists', priority: 1 },
      { model: Album, field: 'title', type: 'albums', priority: 2 },
      { model: Playlist, field: 'name', type: 'playlists', priority: 3 },
      { model: Track, field: 'title', type: 'tracks', priority: 4 }
    ];
  }

  // Tạo cache key
  getCacheKey(query, type = 'all') {
    const normalizedQuery = query.toLowerCase().trim();
    return `${this.cacheConfig.prefix}${type}:${Buffer.from(normalizedQuery).toString('base64')}`;
  }

  // Lấy dữ liệu từ cache
  async getFromCache(key) {
    try {
      // Redis v4+ sử dụng method get trực tiếp
      const cached = await redisClient.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('Redis get error:', error.message);
      return null;
    }
  }

  // Lưu dữ liệu vào cache
  async setCache(key, data) {
    try {
      // Redis v4+ sử dụng setEx thay vì setex
      await redisClient.setEx(key, this.cacheConfig.ttl, JSON.stringify(data));
    } catch (error) {
      console.warn('Redis set error:', error.message);
    }
  }

  // Xóa cache theo pattern
  async invalidateCache(pattern = '*') {
    try {
      // Redis v4+ sử dụng keys method trực tiếp
      const keys = await redisClient.keys(
        `${this.cacheConfig.prefix}${pattern}`
      );
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      console.warn('Redis invalidate error:', error.message);
    }
  }

  // Tạo search configuration
  getSearchConfig(q, exact = false) {
    if (exact) {
      return q.trim();
    }
    return {
      $regex: new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    };
  }

  // Tìm kiếm trong một model cụ thể
  async searchInModel(model, field, query, limit = 10) {
    const searchConfig = this.getSearchConfig(query);

    return await model
      .find({ [field]: searchConfig })
      .limit(limit)
      .lean() // Tối ưu performance
      .exec();
  }

  // Smart search với cache
  async smartSearch(q, options = {}) {
    const { limit = 10, includeAll = false, useCache = true } = options;

    if (!q || q.trim().length < 2) {
      return { result: [], type: 'none', source: 'validation' };
    }

    const normalizedQuery = q.trim();
    const cacheKey = this.getCacheKey(normalizedQuery);

    // Kiểm tra cache trước
    if (useCache) {
      const cached = await this.getFromCache(cacheKey);
      if (cached) {
        return { ...cached, source: 'cache' };
      }
    }

    try {
      // Nếu includeAll = true, tìm kiếm tất cả loại
      if (includeAll) {
        const results = await this.searchAll(normalizedQuery, limit);
        const response = { result: results, type: 'all', source: 'database' };

        if (useCache) {
          await this.setCache(cacheKey, response);
        }

        return response;
      }

      // Tìm kiếm tuần tự theo độ ưu tiên
      for (const { model, field, type } of this.searchModels) {
        const results = await this.searchInModel(
          model,
          field,
          normalizedQuery,
          limit
        );

        if (results.length > 0) {
          const response = { result: results, type, source: 'database' };

          if (useCache) {
            await this.setCache(cacheKey, response);
          }

          return response;
        }
      }

      const response = { result: [], type: 'none', source: 'database' };

      if (useCache) {
        await this.setCache(cacheKey, response);
      }

      return response;
    } catch (error) {
      console.error('Search error:', error);
      return {
        result: [],
        type: 'error',
        error: error.message,
        source: 'database'
      };
    }
  }

  // Tìm kiếm tất cả loại (parallel)
  async searchAll(query, limit = 5) {
    const searchPromises = this.searchModels.map(
      async ({ model, field, type }) => {
        const results = await this.searchInModel(model, field, query, limit);
        return { type, results, count: results.length };
      }
    );

    const allResults = await Promise.all(searchPromises);

    return allResults
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count); // Sắp xếp theo số lượng kết quả
  }

  // Advanced search với nhiều tiêu chí
  async advancedSearch(criteria, options = {}) {
    const { limit = 20, useCache = true } = options;
    const cacheKey = this.getCacheKey(JSON.stringify(criteria), 'advanced');

    if (useCache) {
      const cached = await this.getFromCache(cacheKey);
      if (cached) {
        return { ...cached, source: 'cache' };
      }
    }

    try {
      const searchPromises = [];
      // Tìm kiếm artists
      if (criteria.artist) {
        searchPromises.push(
          Artist.find({ name: this.getSearchConfig(criteria.artist) })
            .limit(limit)
            .lean()
            .then((results) => ({ type: 'artists', results }))
        );
      }

      // Tìm kiếm albums
      if (criteria.album) {
        const albumQuery = { title: this.getSearchConfig(criteria.album) };
        if (criteria.artist) {
          // Tìm albums của artist cụ thể
          const artists = await Artist.find({
            name: this.getSearchConfig(criteria.artist)
          }).lean();
          if (artists.length > 0) {
            albumQuery.artist = { $in: artists.map((a) => a._id) };
          }
        }

        searchPromises.push(
          Album.find(albumQuery)
            .populate('artist')
            .limit(limit)
            .lean()
            .then((results) => ({ type: 'albums', results }))
        );
      }

      // Tìm kiếm tracks
      if (criteria.track) {
        const trackQuery = { title: this.getSearchConfig(criteria.track) };

        searchPromises.push(
          Track.find(trackQuery)
            .populate('artist', 'name')
            .populate('album', 'title')
            .limit(limit)
            .lean()
            .then((results) => ({ type: 'tracks', results }))
        );
      }

      const results = await Promise.all(searchPromises);

      const response = {
        result: results.filter((r) => r.results.length > 0),
        type: 'advanced',
        source: 'database'
      };

      if (useCache) {
        await this.setCache(cacheKey, response);
      }

      return response;
    } catch (error) {
      console.error('Advanced search error:', error);
      return { result: [], type: 'error', error: error.message };
    }
  }

  // Autocomplete suggestions
  async getAutocompleteSuggestions(q, options = {}) {
    const { limit = 5, types = ['artists', 'albums', 'tracks'] } = options;
    const cacheKey = this.getCacheKey(q, 'autocomplete');

    const cached = await this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const suggestions = [];

      for (const { model, field, type } of this.searchModels) {
        if (types.includes(type)) {
          const results = await model
            .find({ [field]: this.getSearchConfig(q) })
            .select(field)
            .limit(limit)
            .lean();

          suggestions.push(
            ...results.map((item) => ({
              text: item[field],
              type,
              id: item._id
            }))
          );
        }
      }

      // Loại bỏ duplicate và sắp xếp
      const uniqueSuggestions = suggestions
        .filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (t) => t.text.toLowerCase() === item.text.toLowerCase()
            )
        )
        .sort((a, b) => a.text.localeCompare(b.text))
        .slice(0, limit * types.length);

      await this.setCache(cacheKey, uniqueSuggestions);
      return uniqueSuggestions;
    } catch (error) {
      console.error('Autocomplete error:', error);
      return [];
    }
  }

  // Lấy thống kê search
  async getSearchStats() {
    try {
      const stats = {};
      const keys = await redisClient.keys(`${this.cacheConfig.prefix}*`);

      stats.totalCachedQueries = keys.length;
      stats.cacheHitRate = await this.getCacheHitRate();

      return stats;
    } catch (error) {
      console.error('Stats error:', error);
      return {};
    }
  }

  // Tính cache hit rate (implementation mở rộng)
  async getCacheHitRate() {
    try {
      const hits = (await redisClient.get('search:hits')) || 0;
      const total = (await redisClient.get('search:total')) || 0;

      if (total > 0) {
        return (parseInt(hits, 10) / parseInt(total, 10)) * 100;
      }
      return 0;
    } catch (error) {
      console.error('Cache hit rate error:', error);
      return 0;
    }
  }

  // Track cache usage (helper method)
  async trackCacheUsage(hit = false) {
    try {
      await redisClient.incr('search:total');
      if (hit) {
        await redisClient.incr('search:hits');
      }
    } catch (error) {
      console.warn('Track cache error:', error.message);
    }
  }

  // Cleanup và đóng kết nối
  async cleanup() {
    try {
      if (redisClient) {
        await redisClient.quit();
      }
    } catch (error) {
      console.error('Redis cleanup error:', error);
    }
  }
}

module.exports = new SearchService();
