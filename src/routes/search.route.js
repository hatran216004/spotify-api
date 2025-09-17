const express = require('express');
const {
  smartSearch,
  advancedSearch,
  autocomplete,
  searchAll,
  getSearchStats,
  clearCache
} = require('../controllers/search.controller');

const router = express.Router();

// Main search endpoint (smart search)
router.get('/', smartSearch);

// Search all types at once
router.get('/all', searchAll);

// Advanced search with multiple criteria
router.get('/advanced', advancedSearch);

// Autocomplete suggestions
router.get('/autocomplete', autocomplete);

// Search statistics
router.get('/stats', getSearchStats);

// Clear cache (admin only)
router.delete('/cache', clearCache);

module.exports = router;
