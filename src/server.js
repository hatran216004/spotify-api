require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');

const app = require('./app');
const client = require('./lib/redis');

// Xử lý lỗi đồng bộ (trong ứng dụng chưa được xử lý)
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION 🥱, SHUTTING DOW...');
  process.exit(1);
});

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(db).then(() => console.log('db connected'));

(async () => {
  await client.connect();
})();

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION, SHUTTING DOW...');
  // Hoàn thành tất cả các request đang thực hiện và đang đợi xog mới exit
  server.close(() => {
    process.exit(1); // 1: Ngoại lệ chưa được phát hiện
  });
});
