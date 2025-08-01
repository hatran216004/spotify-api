const morgan = require('morgan');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { clerkMiddleware } = require('@clerk/express');
const AppError = require('./utils/appError');

const {
  userRoutes,
  authRoutes,
  songRoutes,
  statsRoutes,
  albumRoutes,
  adminRoutes,
  playlistRoutes,
  artistRoutes,
  searchRoutes
} = require('./routes/index');

const globalErrorHandler = require('./controllers/error.controller');

const app = express();

app.use(
  cors({
    // origin: process.env.CLIENT_URL,
    origin: 'http://localhost:5173',
    credentials: true
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(clerkMiddleware());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/songs', songRoutes);
app.use('/api/v1/albums', albumRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/playlists', playlistRoutes);
app.use('/api/v1/artists', artistRoutes);
app.use('/api/v1/search', searchRoutes);

app.all(/.*/, (req, res, next) => {
  next(
    new AppError(`Can't find ${req.originalUrl} on this server (●'◡'●)`, 404)
  );
});
app.use(globalErrorHandler);

module.exports = app;
