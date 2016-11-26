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

            socket.on('msg:typingStatus', data => typingStatusFn(data, socket));

            socket.on('msg:launchStatusCreate', data => launchStatusCreateFn(data, socket));

            socket.on('msg:appStatus', data => appStatusFn(data, socket));

            socket.on('disconnect', data => disconnectFn(data, socket));
        });

        /**
         * `msg:join`. Called when a socket joins the pool. Socket is added to the correct rooms based on the data
         * passed to the function. Sockets which provide a correct token may be added to the moderator
         * and privileges rooms. Sockets which do not provide a token are added to the guest room.
         *
         * @param data {*} May contain a token property which can be checked for correctness. From there, the user
         * can be retrieved, and their privileges can be queried.
         * @param socket {Socket} The socket in question.
         */
        var joinFn = function(data, socket) {
            let user;

            if (data.token && authenticationService.isJsonWebTokenCorrect(data.token)) {
                // Check is user is a moderator
                authenticationService.userHasPermission("moderator", data.token).then(u => {
                    user = u;
                    socket.join('room:moderator');
                    socket.join('room:privileges');
                }, u => {
                    user = u;
                    socket.join('room:privileges');
                });
            } else {
                socket.join('room:guests');
            }

            store.log("msg:join", data, user);
            store.incrementCurrentViewers();
        };

        /**
         * `msg:typingStatus`. Sends a typing status notification from one privileged user
         * to all other privileged users.
         *
         * @param data {*} Data sent to the socket for this request.
         * @param socket {Socket} The socket in question.
         */
        var typingStatusFn = function(data, socket) {
            authenticationService.userHasPermission("privileges", data.token).then(user => {

                store.log("msg:typingStatus", data, user).then(idAndTimestamp => {

                    delete data.token;
                    data.id = idAndTimestamp.id;
                    data.user = user.username;
                    data.timestamp = idAndTimestamp.timestamp;

                    io.to('privileges').emit('msg:typingStatus', data);
                });
            });
        };

        /**
         * `msg:launchStatusCreate`. Called when a privileged socket sends up a launch status creation request.
         * The data provided is checked to ensure it has the correct properties and values, is logged as an event,
         * has data appended to it, and is then logged to to the launchStatuses list in the redis store.
         *
         * @param data {*} Data sent to the socket for this request.
         * @param socket {Socket} The socket in question.
         */
        var launchStatusCreateFn = function(data, socket) {
            authenticationService.userHasPermission("privileges", data.token).then(user => {
                // Ensure the data contained within statusType is correct.
                let statusTypes = ["update", "moment"];
                if (!statusTypes.includes(data.statusType)) {
                    throw new Error(422);
                }

                // Ensure the data contained within the momentType, if it exists, is correct.
                let momentTypes = ['upcoming', 'propellantLoading', 'startup', 'liftoff', 'maxQ', 'meco',
                'stageSeparation', 'secondStageIgnition', 'firstStageBoostbackStartup', 'firstStageBoostbackShutdown',
                'fairingSeparation', 'firstStageReentryStartup', 'firstStageReentryShutdown', 'firstStageLandingStartup',
                'firstStageTransonic', 'touchdown', 'landingSuccess', 'seco', 'secondStageRelight', 'seco2',
                'dragonDeploy', 'payloadDeploy', 'launchSuccess', 'launchFailure', 'pauseCountdown',
                'resumeCountdown', 'scrub'];
                if (data.statusType == "moment" && !momentTypes.includes(data.momentType)) {
                    throw new Error(422);
                }

                // log an event, insert status into statuses list.
                store.log('msg:launchStatusCreate', data, user).then(idAndTimestamp => {
                    // Append the user, the timestamp, and the id as per the
                    // message architecture documentation
                    delete data.token;
                    data.id = idAndTimestamp.id;
                    data.user = user.username;
                    data.timestamp = idAndTimestamp.timestamp;
                    data.isDeleted = false;

                    store.addLaunchStatus(data).then(index => {

                        data.statusId = index;
                        socket.broadcast.emit("msg:launchStatusCreate", data);
                        socket.emit("response:launchStatusCreate", {responseCode: 200, response: data });
                    });
                });

            }).catch(error => {
                return socket.emit('response:launchStatusCreate', { responseCode: error.message });
            });
        };

        /**
         * `msg:appStatus`. Called when a socket sends a message updating the status of the application. This
         * can be of the types "enableApp", "disableApp", "editLivestream", "editLaunch", or "editMoments".
         *
         * @param data {*} Data sent to the socket for this request.
         * @param socket {Socket} The socket in question.
         */
        var appStatusFn = function(data, socket) {

            // Ensure the socket user has the correct permissions
            authenticationService.userHasPermission("moderator", data.token).then(user => {
                // If the type is not one of the permitted status types, return an error code
                // to the originating socket.
                let types = ["enableApp", "disableApp", "editLivestream", "editLaunch", "editMoments"];
                if (!types.includes(data.type)) {
                    throw new Error(422);
                }

                // log incoming data to redis.
                store.log("msg:appStatus", data, user).then(idAndTimestamp => {

                    // Append the user, the timestamp, and the id as per the
                    // message architecture documentation
                    delete data.token;
                    data.id = idAndTimestamp.id;
                    data.user = user.username;
                    data.timestamp = idAndTimestamp.timestamp;

                    // Handle multiple status types here
                    let p1;
                    switch (data.type) {
                        case "enableApp":

                            data.data.beganAt = idAndTimestamp.timestamp;

                            p1 = Promise.all([
                                store.isAppActive(true),
                                store.setLaunch(data.data)
                            ]);
                            break;

                        case "disableApp":
                            // TODO
                            p1 = store.isAppActive(false);
                            break;

                        case "editLivestream":
                            // TODO
                            break;

                        case "editLaunch":
                            // TODO
                            p1 = store.setLaunch(message.data);
                            break;

                        case "editMoments":
                            // TODO
                            break;
                    }

                    // Broadcast a response once the data has been added to the store.
                    p1.then(() => {
                        socket.broadcast.emit("msg:appStatus", data);
                        socket.emit("response:appStatus", {responseCode: 200, response: data });
                    });
                });

            }, () => {
                throw new Error(400);

            }).catch(error => {
                return socket.emit('response:appStatus', { responseCode: error.message });
            });
        };

        /**
         * Called when a socket disconnects from the server. This indicates they've left the webpage. Log
         * a disconnect event.
         *
         * @param data {*} Data sent with the disconnection event.
         * @param socket {Socket} The socket in question.
         */
        var disconnectFn = function(data, socket) {
            store.log('disconnect', data);
            store.decrementCurrentViewers();
        }
    }
};