const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    const db = process.env.DATABASE.replace(
      '<PASSWORD>',
      process.env.DATABASE_PASSWORD
    );

    await mongoose.connect(db);
    console.log('db connected');
  } catch (error) {
    console.log('Failed to connect db');
    process.exit(1);
  }
};

module.exports = connectDb;
