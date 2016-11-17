var SocketServer = require('socket.io');
var AuthenticationService = new require('./services/AuthenticationService')();

function createServer(server) {
    var io = new SocketServer(server);
    var authenticationService = new AuthenticationService();

    /**
     *
     */
    io.on('connection', socket => {

        socket.on('msg:join', joinFn);

        socket.on('msg:appStatus', appStatusFn);
    });

    /**
     * Called when a socket joins the pool. Socket is added to the correct rooms based on the data
     * passed to the function. Sockets which provide a correct token may be added to the moderator
     * and privileges rooms. Sockets which do not provide a token are added to the guest room.
     *
     *
     * @param data  May contain a token property which can be checked for correctness. From there, the user
     * can be retrieved, and their privileges can be queried.
     */
    var joinFn = function(data) {
        if (data.token && authenticationService.isJsonWebTokenCorrect(data.token)) {
            if (authenticationService.getUser(data.token).privileges.includes('moderator')) {
                socket.join('room:moderator');
                // console.log
            }
            socket.join('room:privileges');
        } else {
            socket.join('room:guests');
        }
    };

    /**
     *
     * @param data
     */
    var appStatusFn = function(data) {
        console.log(data); // http://socket.io/docs/rooms-and-namespaces/#default-room
    }
}

module.exports = createServer;