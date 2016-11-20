var SocketServer = require('socket.io');
var AuthenticationService = require('./services/AuthenticationService');
var Store = require('./services/StoreService');

module.exports = {
    createServer: function(server) {
        var io = new SocketServer(server);
        var authenticationService = new AuthenticationService();
        var store = new Store();

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
         * @param data {*} May contain a token property which can be checked for correctness. From there, the user
         * can be retrieved, and their privileges can be queried.
         * @param socket {Socket} The socket of concern.
         */
        var joinFn = function(data, socket) {
            if (data.token && authenticationService.isJsonWebTokenCorrect(data.token)) {
                // Check is user is a moderator
                authenticationService.userHasPermission("moderator", data.token).then(user => {
                    socket.join('room:moderator');
                });
                socket.join('room:privileges');

            } else {
                socket.join('room:guests');
            }
        };

        /**
         * `msg:appStatus`. Called when a socket sends a message updating the status of the application. This
         * can be of the types "enableApp", "disableApp", "editLivestream", or "editLaunch".
         *
         * @param data {*}
         * @param socket {Socket}
         */
        var appStatusFn = function(data, socket) {
            // Ensure the socket user has the correct permissions
            authenticationService.userHasPermission("moderator", data.token)
            .then(user => {
                // Delete the token used to authenticate the websocket message. It is not needed.
                delete data.token;

                // If the statusType is not one of the permitted status types, return an error code
                // to the originating socket.
                let statusTypes = ["enableApp", "disableApp", "editLivestream", "editLaunch", "editEvent"];
                if (!statusTypes.includes(data.statusType)) {
                    throw new Error(422);
                }

                // build broadcasted message and log it to redis.
                return store.logEvent("msg:appStatus",
                    {
                        user: user.username,
                        statusType: data.statusType,
                        data: data.data
                    }
                );
            }, () => {
                throw new Error(400);

            }).then(message => {

                // Handle multiple status types here.
                let p1;
                switch (message.statusType) {
                    case "enableApp":
                        p1 = Promise.all([
                            store.isAppActive(true),
                            store.setLaunch(message.data)
                        ]);
                        break;
                    case "disableApp":
                        p1 = store.isAppActive(false);
                        break;
                    case "editLivestream":
                        // TODO
                        break;
                    case "editLaunch":
                        p1 = store.setLaunch(message.data);
                        break;
                }

                // Broadcast a response once the data has been added to the store.
                p1.resolve(data => {
                    socket.broadcast.emit("msg:appStatus", message);
                    socket.emit("response:appStatus", {statusCode: 200});
                });

            }).catch(error => {
                return socket.emit('response:appStatus', { statusCode: error.message });
            });
        }
    }
};