const { createClient } = require('redis');

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  password: process.env.REDIS_PASSWORD
});

client.on('error', (error) => console.log(error));
client.on('connect', () => console.log('redis connect successfully'));

module.exports = client;
