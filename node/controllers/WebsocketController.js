var SocketServer = require('socket.io');
var AuthenticationService = require('../services/authenticationService');
var Store = require('../services/StoreService');
var Reddit = require('../services/RedditService');
var Livestream = require('../services/LivestreamService');

class WebsocketController {

    constructor(io) {
        this.io = io;
        this.authenticationService = new AuthenticationService();
        this.store = new Store();
        this.reddit = new Reddit();
    }

    /**
     * `msg:join`. Called when a socket joins the pool. Socket is added to the correct rooms based on the data
     * passed to the function. Sockets which provide a correct token may be added to the moderator
     * and privileges rooms. Sockets which do not provide a token are added to the guest room.
     *
     * @param data {*} May contain a token property which can be checked for correctness. From there, the user
     * can be retrieved, and their privileges can be queried.
     * @param socket {Socket} The socket in question.
     */
    join(data, socket) {
        let user;

        if (data.token && this.authenticationService.isJsonWebTokenCorrect(data.token)) {
            // Check is user is a moderator
            this.authenticationService.userHasPermission("moderator", data.token).then(u => {
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

        this.store.log("msg:join", data, user);
        this.store.incrementCurrentViewers();
    }

    /**
     * `msg:typingStatus`. Sends a typing status notification from one privileged user
     * to all other privileged users.
     *
     * @param data {*} Data sent to the socket for this request.
     * @param socket {Socket} The socket in question.
     */
    typingStatus(data, socket) {
        this.authenticationService.userHasPermission("privileges", data.token).then(user => {

            this.store.log("msg:typingStatus", data, user).then(idAndTimestamp => {

                delete data.token;
                data.id = idAndTimestamp.id;
                data.user = user.username;
                data.timestamp = idAndTimestamp.timestamp;

                io.to('privileges').emit('msg:typingStatus', data);
            });
        });
    }

    /**
     * `msg:launchStatusCreate`. Called when a privileged socket sends up a launch status creation request.
     * The data provided is checked to ensure it has the correct properties and values, is logged as an event,
     * has data appended to it, and is then logged to to the launchStatuses list in the redis store.
     *
     * @param data {*} Data sent to the socket for this request.
     * @param socket {Socket} The socket in question.
     */
    launchStatusCreate(data, socket) {
        this.authenticationService.userHasPermission("privileges", data.token).then(user => {
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
            this.store.log('msg:launchStatusCreate', data, user).then(idAndTimestamp => {
                // Append the user, the timestamp, and the id as per the
                // message architecture documentation
                delete data.token;
                data.id = idAndTimestamp.id;
                data.user = user.username;
                data.timestamp = idAndTimestamp.timestamp;
                data.isDeleted = false;

                // Fetch the countdown details at this time, so if the countdown changes we will
                // always have a reference of what the countdown was when this launch status
                // was posted.
                this.store.getLaunch(["countdown", "isPaused"]).then(launchDetails => {

                    data.countdown = launchDetails[0];
                    data.isPaused = launchDetails[1];

                    // Add the launch status.
                    this.store.addLaunchStatus(data).then(index => {

                        data.statusId = index;

                        // Emit the launch status
                        socket.broadcast.emit("msg:launchStatusCreate", data);
                        socket.emit("response:launchStatusCreate", {responseCode: 200, response: data });

                        // Update the Reddit thread
                        this.reddit.editThread();
                    });
                });
            });

        }).catch(error => {
            return socket.emit('response:launchStatusCreate', { responseCode: error.message });
        });
    }

    /**
     * `msg:appStatus`. Called when a socket sends a message updating the status of the application. This
     * can be of the types "enableApp", "disableApp", "editLaunch", or "editMoments".
     *
     * @param data {*} Data sent to the socket for this request.
     * @param socket {Socket} The socket in question.
     */
    appStatus(data, socket) {
        // Ensure the socket user has the correct permissions
        this.authenticationService.userHasPermission("moderator", data.token).then(user => {
            // If the type is not one of the permitted status types, return an error code
            // to the originating socket.
            let types = ["enableApp", "disableApp", "editLaunch", "editMoments"];
            if (!types.includes(data.type)) {
                throw new Error(422);
            }

            // log incoming data to redis.
            this.store.log("msg:appStatus", data, user).then(idAndTimestamp => {

                // Append the user, the timestamp, and the id as per the
                // message architecture documentation
                delete data.token;
                data.id = idAndTimestamp.id;
                data.user = user.username;
                data.timestamp = idAndTimestamp.timestamp;

                // Handle multiple status types here
                switch (data.type) {
                    // When the application is enabled.
                    case "enableApp":
                        data.data.beganAt = idAndTimestamp.timestamp;
                        data.data.isPaused = false;

                        Promise.all([
                            this.store.isAppActive(true),
                            this.store.setLaunch(data.data)
                        ]).then(() => {
                            // Reddit thread creation
                            return this.reddit.createThread();
                        }).then(() => {
                            // Broadcast response
                            socket.broadcast.emit("msg:appStatus", data);
                            socket.emit("response:appStatus", {responseCode: 200, response: data });

                        }).catch(() => {
                            socket.emit("response:appStatus", {responseCode: 500, response: data });
                        });
                        break;

                    case "disableApp":
                        this.store.isAppActive(false).then(() => {
                            socket.broadcast.emit("msg:appStatus", data);
                            socket.emit("response:appStatus", {responseCode: 200, response: data });
                        });
                        break;

                    case "editLaunch":
                        this.store.setLaunch(message.data).then(() => {
                            return this.reddit.editThread();
                        }).then(() => {
                            socket.broadcast.emit("msg:appStatus", data);
                            socket.emit("response:appStatus", {responseCode: 200, response: data });

                        }).catch(() => {
                            socket.emit("response:appStatus", {responseCode: 500, response: data });
                        });
                        break;

                    case "editMoments":
                        // TODO
                        break;
                }
            });

        }, () => {
            throw new Error(400);

        }).catch(error => {
            return socket.emit('response:appStatus', { responseCode: error.message });
        });
    }

    webcastStatus(data) {
        return this.io.emit('msg:webcastStatus', data);
    }

    /**
     * Called when a socket disconnects from the server. This indicates they've left the webpage. Log
     * a disconnect event.
     *
     * @param data {*} Data sent with the disconnection event.
     * @param socket {Socket} The socket in question.
     */
    disconnect(data, socket) {
        this.store.log('disconnect', data);
        this.store.decrementCurrentViewers();
    }
}

module.exports = WebsocketController;