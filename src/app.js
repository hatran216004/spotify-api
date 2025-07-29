const morgan = require('morgan');
const express = require('express');
const { clerkMiddleware } = require('@clerk/express');

const {
  userRoutes,
  authRoutes,
  songRoutes,
  statsRoutes,
  albumRoutes,
  adminRoutes
} = require('./routes/index');

const app = express();

app.use(express.json());

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

module.exports = app;
