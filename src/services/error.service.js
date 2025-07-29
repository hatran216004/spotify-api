const AppError = require('../utils/appError');

class ErrorService {
  handleCastErrorDB(error) {
    const message = `Invalid ${error.path}: ${error.value}`;
    return new AppError(message, 400);
  }

  handleDuplicateFieldsDB(error) {
    const errorField = Object.keys(error.keyValue)[0];
    const errorValue = error.keyValue[errorField];
    const message = `Duplicate field ${errorField}, value: ${errorValue}. Please enter another value`;
    return new AppError(message, 400);
  }

  handleValidationErrorDB(error) {
    const errors = Object.values(error.errors).map((ele) => ele.message);
    const message = `Invalid input value: ${errors.join('. ')}`;
    return new AppError(message, 400);
  }

  sendErrorDev(error, req, res) {
    console.log(error);
    if (req.originalUrl.startsWith('/api')) {
      return res.status(error.statusCode).json({
        error,
        message: error.message,
        status: error.status,
        stack: error.stack
      });
    }
  }

  sendErrorProd(error, req, res) {
    if (req.originalUrl.startsWith('/api')) {
      if (error.isOperational) {
        return res.status(error.statusCode).json({
          message: error.message,
          staus: error.status,
          statusCode: error.statusCode
        });
      }

      return res.status(500).json({
        message: 'Internal server error',
        status: 'error'
      });
    }
  }
}

module.exports = new ErrorService();
