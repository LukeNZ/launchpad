var SocketServer = require('socket.io');
var WebsocketController = require('./controllers/WebsocketController');

module.exports = {
    createServer: function(server) {
        var io = new SocketServer(server);
        var websocket = new WebsocketController(io);

        /**
         * Handle incoming events.
         */
        io.on('connection', socket => {
            socket.on('msg:join', data => websocket.join(data, socket));

            socket.on('msg:typingStatus', data => websocket.typingStatus(data, socket));

            socket.on('msg:launchStatusCreate', data => websocket.launchStatusCreate(data, socket));

            socket.on('msg:appStatus', data => websocket.appStatus(data, socket));

            socket.on('disconnect', data => websocket.disconnect(data, socket));
        });
    }
};