const escape = require('./escape');

module.exports = async io => {

  const things = {
    'Developers': 'Lots of projects, very little sleep',
    'Code': 'More lines of code means more money',
    'Events': 'Not your momma\'s client-server communication'
  };

  io.on('connection', socket => {

    socket.on('add', thing => {
      thing = escape(thing);
      things[thing] = "";
      io.emit('things', things);
    });

    socket.on('edit', (thing, content) => {
      thing = escape(thing);
      things[thing] = content;
      io.emit('things', things);
    });

    socket.emit('things', things);
    io.emit('numClients', io.sockets.size);

  });

};
