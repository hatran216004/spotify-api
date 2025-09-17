const searchService = require('../services/search.service');
const { sendSuccess, catchAsync } = require('../utils');

// Smart search endpoint
exports.smartSearch = catchAsync(async (req, res, next) => {
  const q = req.query.q?.trim();
  if (!q) {
    return sendSuccess(
      res,
      { result: [], type: 'none', source: 'validation' },
      200
    );
  }

  const options = {
    limit: parseInt(req.query.limit, 10) || 10,
    includeAll: req.query.includeAll === 'true',
    useCache: req.query.useCache !== 'false' // Default true
  };

  const searchResult = await searchService.smartSearch(q, options);

  // Track cache usage for analytics
  await searchService.trackCacheUsage(searchResult.source === 'cache');

  const { result, type, source } = searchResult;

  sendSuccess(
    res,
    {
      result,
      type,
      source,
      query: q,
      total: Array.isArray(result) ? result.length : 0
    },
    200
  );
});

// Advanced search endpoint
exports.advancedSearch = catchAsync(async (req, res, next) => {
  const { artist, album, track } = req.query;

  if (!artist && !album && !track) {
    return sendSuccess(
      res,
      { result: [], type: 'none', source: 'validation' },
      200
    );
  }

  const criteria = {};
  if (artist) criteria.artist = artist.trim();
  if (album) criteria.album = album.trim();
  if (track) criteria.track = track.trim();

  const options = {
    limit: parseInt(req.query.limit, 10) || 20,
    useCache: req.query.useCache !== 'false'
  };

  const searchResult = await searchService.advancedSearch(criteria, options);

  await searchService.trackCacheUsage(searchResult.source === 'cache');

  const { result, type, source } = searchResult;

  sendSuccess(
    res,
    {
      result,
      type,
      source,
      criteria,
      total: Array.isArray(result) ? result.length : 0
    },
    200
  );
});

// Autocomplete suggestions endpoint
exports.autocomplete = catchAsync(async (req, res, next) => {
  const q = req.query.q?.trim();

  if (!q || q.length < 2) {
    return sendSuccess(res, [], 200);
  }

  const options = {
    limit: parseInt(req.query.limit, 10) || 5,
    types: req.query.types
      ? req.query.types.split(',')
      : ['artists', 'albums', 'tracks']
  };

  const suggestions = await searchService.getAutocompleteSuggestions(
    q,
    options
  );

  sendSuccess(res, suggestions, 200);
});

// Search all types endpoint
exports.searchAll = catchAsync(async (req, res, next) => {
  const q = req.query.q?.trim();

  if (!q) {
    return sendSuccess(
      res,
      { result: [], type: 'none', source: 'validation' },
      200
    );
  }

  const limit = parseInt(req.query.limit, 10) || 5;
  const results = await searchService.searchAll(q, limit);

  sendSuccess(
    res,
    {
      result: results,
      type: 'all',
      source: 'database',
      query: q,
      total: results.reduce((sum, item) => sum + item.count, 0)
    },
    200
  );
});

// Get search statistics
exports.getSearchStats = catchAsync(async (req, res, next) => {
  const stats = await searchService.getSearchStats();
  sendSuccess(res, stats, 200);
});

// Clear search cache
exports.clearCache = catchAsync(async (req, res, next) => {
  const pattern = req.query.pattern || '*';
  await searchService.invalidateCache(pattern);

  sendSuccess(
    res,
    {
      message: 'Cache cleared successfully',
      pattern: `search:${pattern}`
    },
    200
  );
});
