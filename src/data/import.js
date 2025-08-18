require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const { Artist, Playlist, Track, Album } = require('../models');

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const artists = JSON.parse(
  fs.readFileSync(`${__dirname}/artists.json`, {
    encoding: 'utf-8'
  })
);

const playlists = JSON.parse(
  fs.readFileSync(`${__dirname}/playlists.json`, {
    encoding: 'utf-8'
  })
);

const tracks = JSON.parse(
  fs.readFileSync(`${__dirname}/tracks.json`, {
    encoding: 'utf-8'
  })
);

const albums = JSON.parse(
  fs.readFileSync(`${__dirname}/albums.json`, {
    encoding: 'utf-8'
  })
);

const importData = async () => {
  try {
    // await Artist.create(artists);
    await Album.create(albums);
    console.log('data import successfully');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

mongoose.connect(db).then(() => {
  console.log('db connected');
  importData();
});
