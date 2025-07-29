const errorService = require('../services/error.service');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === 'development') {
    errorService.sendErrorDev(err, req, res);
  } else if (nodeEnv === 'production') {
    let error = { ...err, message: err.message, name: err.name };

    if (error.name === 'CastError')
      error = errorService.handleCastErrorDB(error);
    if (error.code === 11000)
      error = errorService.handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = errorService.handleValidationErrorDB(error);

    errorService.sendErrorProd(error, req, res);
  }
};
