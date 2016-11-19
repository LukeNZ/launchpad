var SocketServer = require('socket.io');
var AuthenticationService = require('./services/AuthenticationService');
var RedisStore = require('./services/StorageService');

module.exports = {
    createServer: function(server) {
        var io = new SocketServer(server);
        var authenticationService = new AuthenticationService();
        var redisStore = new RedisStore();

        /**
         * Handle incoming events.
         */
        io.on('connection', socket => {
            socket.on('msg:join', data => joinFn(data, socket));

            socket.on('msg:appStatus', data => appStatusFn(data, socket));
        });

        /**
         * `msg:join`. Called when a socket joins the pool. Socket is added to the correct rooms based on the data
         * passed to the function. Sockets which provide a correct token may be added to the moderator
         * and privileges rooms. Sockets which do not provide a token are added to the guest room.
         *
         * @param data  May contain a token property which can be checked for correctness. From there, the user
         * can be retrieved, and their privileges can be queried.
         *
         * @param socket The socket of concern.
         */
        var joinFn = function(data, socket) {
            if (data.token && authenticationService.isJsonWebTokenCorrect(data.token)) {

                authenticationService.userHasPermission("moderator", data.token).then(user => {
                    socket.join('room:moderator');
                    console.log('moderator joined');
                });

                socket.join('room:privileges');
                console.log('privileges joined');
            } else {
                socket.join('room:guests');
                console.log('guest joined');
            }
        };

        /**
         * `msg:appStatus`. Called when a sockets sends a message updating the status of the application. Th
         *
         * @param data
         * @param socket
         */
        var appStatusFn = function(data, socket) {
            // Ensure the socket user has the correct permissions
            authenticationService.userHasPermission("moderator", data.token)
            .then(user => {
                delete data.token;

                let statusTypes = ["enableApp", "disableApp", "editLivestreamData", "editLaunchData"];

                // If the statusType is not one of the permitted status types, return an error code
                // to the originating socket.
                if (!statusTypes.includes(data.statusType)) {
                    throw new Error(422);
                }

                // build broadcasted message and log it to redis.
                return redisStore.logEvent("msg:appStatus",
                    {
                        user: user.username,
                        statusType: data.statusType,
                        data: data.data
                    }
                );
            }, () => {
                throw new Error(400);

            }).then(message => {
                // Data manipulation here.

                // Broadcast a response
                socket.broadcast.emit("msg:appStatus", message);
                socket.emit("response:appStatus", { statusCode: 200 });

            }).catch(error => {
                socket.emit('response:appStatus', { statusCode: error.message });
            });
        }
    }
};