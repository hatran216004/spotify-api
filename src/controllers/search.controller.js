const searchService = require('../services/search.service');
const { sendSuccess } = require('../utils');

exports.smartSearch = async (req, res, next) => {
  const q = req.query.q?.trim();
  if (!q) {
    return sendSuccess(res, { result: [], type: 'none' }, 200);
  }

  const { type, result } = await searchService.smartSearch(q);
  sendSuccess(res, { result, type }, 200);
};
