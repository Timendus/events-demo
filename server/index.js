const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const thingsAPI = require('./things-api');
const config = require('../package.json').configuration;

app.use((req, res, next) => {
  console.log(`Received request for events-demo:${config.server.port}${req.url}`, req.headers['x-forwarded-for'] || req.connection.remoteAddress);
  next();
});

// Host static files
app.use(express.static('client'));
// Mount events API using socket.io
thingsAPI(io.of('/things'));

server.listen(config.server.port, () =>
  console.log(`Server is listening on port ${config.server.port}`));
