var redis = require("redis");

/**
 * Service which wraps a redis client, allowing the calling of application-specific storage functions.
 *
 * TODO:
 * Download all data
 * Event logger
 * Retrieve livestream status/information
 * Update livestream status/information
 * Get all launch updates
 * Insert launch update
 * Remove launch update
 * Get specific launch update
 * Set specific launch update
 */
class StorageService {

    /**
     * Constructs a redis client.
     */
    constructor() {
        this.client = redis.createClient();
    }

    logEvent(eventName, data) {
        return new Promise((resolve, reject) => {

            // Append a timestamp to the data
            data.timestamp = (new Date()).toISOString();

            this.client.rpush("events", JSON.stringify({
                event: eventName,
                body: data
            }), (err, response) => {
                if (err) reject(err);

                data.event_id = response;
                return resolve(data);
            });
        });
    }

    /**
     * Getter and setter for the app activity status. If a boolean argument is passed through, the app activity status
     * will be set to the value of the arg. If `isAppActiveSetter` is undefined, the current app activity status
     * will be returned.
     *
     * @param isAppActiveSetter {boolean} Optional argument to set the current app activity status. Must be a boolean.
     *
     * @returns {Promise} If used as a setter, resolves with the reply from the Redis store. Otherwise will
     * resolve/reject with no response.
     */
    isAppActive(isAppActiveSetter) {
        return new Promise((resolve, reject) => {
            if (isAppActiveSetter == undefined) {
                this.client.get("isActive", (err, reply) => {
                    if (err) reject(err);
                    return resolve(reply);
                });

            } else if (isAppActiveSetter === true || isAppActiveSetter === false) {
                this.client.set("isActive", isAppActiveSetter);
                return resolve();
            }

            return reject();
        });
    }

    getUpdates() {
        return new Promise((resolve, reject) => {

        });
    }
}

module.exports = StorageService;