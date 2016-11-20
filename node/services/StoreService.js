var redis = require("redis");

/**
 * Service which wraps a redis client, allowing the calling of application-specific storage functions.
 *
 * TODO:
 * Download all data
 * Retrieve livestream status/information
 * Update livestream status/information
 * Get all launch updates
 * Insert launch update
 * Remove launch update
 * Get specific launch update
 * Set specific launch update
 */
class StoreService {

    /**
     * Constructs a redis client.
     */
    constructor() {
        this.client = redis.createClient();
    }

    /**
     * Logs a websocket event to Redis.
     *
     * Pushes the event into the `events` list in Redis, and also adds `timestamp` (ISO8601 datetime string)
     * and `event_id` properties to the data.
     *
     * @param eventName {string} The namespace that the event occurred under.
     * @param dataObj {*} Data that came with the message.
     *
     * @returns {Promise} Returns a promise that resolves to the updated data.
     */
    logEvent(eventName, dataObj) {
        return new Promise((resolve, reject) => {

            // Append a timestamp to the data
            dataObj.timestamp = (new Date()).toISOString();

            return this.client.rpush("events", JSON.stringify({
                event: eventName,
                body: dataObj
            }), (err, response) => {

                dataObj.event_id = response;
                return resolve(dataObj);
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
     * @returns {Promise} If used as a getter, resolves with a boolean reply from the Redis store. Otherwise will
     * resolve/reject with no response.
     */
    isAppActive(isAppActiveSetter) {
        return new Promise((resolve, reject) => {
            if (isAppActiveSetter == undefined) {
                return this.client.get("isActive", (err, reply) => resolve(reply === "true"));

            } else if (isAppActiveSetter === true || isAppActiveSetter === false) {
                this.client.set("isActive", isAppActiveSetter);
                return resolve();
            }

            return reject();
        });
    }

    /**
     * Gets the launch state of the application.
     *
     * If launchProperty is not passed into the function, all fields from the launch hash will be retrieved.
     * If the launchProperty is a string, that specific field from the launch hash will be fetched. Otherwise,
     * the function will reject.
     *
     * @param launchProperty {undefined|string} Optional argument, that if set will return only that field from
     * the launch hash.
     *
     * @returns {Promise} Returns a promise that resolves to the launch hash or specific hash field.
     */
    getLaunch(launchProperty) {
        return new Promise((resolve, reject) => {
            if (launchProperty == undefined) {
                return this.client.hgetall("launch", (err, reply) => resolve(reply));

            } else if (typeof launchProperty === "string") {
                return this.client.hget("launch", launchProperty, (err, reply) => resolve(reply));

            }
            return reject();
        });
    }

    /**
     * Sets launch properties for the application.
     *
     * Inserts the keys and values of dataObj as the keys and values of fields on the `launch` hash in Redis.
     * If dataObj is null or undefined the function will reject.
     *
     * @param dataObj {*}   An object of keys and values to be set on the `launch` hash in Redis.
     *
     * @returns {Promise} Returns a promise that resolves to the reply from Redis once the hash fields have been
     * set.
     */
    setLaunch(dataObj) {
        return new Promise((resolve, reject) => {
            if (dataObj != null) {
                return this.client.hmset("launch", dataObj, (err, reply) => resolve(reply));
            }
            return reject();
        });
    }

    getLivestream(livestreamKey) {

    }

    setLivestream(livestreamKey, dataObj) {

    }

    getUpdates() {
        return new Promise((resolve, reject) => {

        });
    }

    getEvents() {
        return new Promise((resolve, reject) => {

        });
    }
}

module.exports = StoreService;