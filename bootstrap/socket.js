var io = require('socket.io')(9000);
console.log("server listenng on port 9000");
io.sockets.on("connection", function (s) {
    console.log("CONNECTION MADE!!!");
    s.emit('welcomemessage', { hello: "world" });

});

module.exports.io = io;
