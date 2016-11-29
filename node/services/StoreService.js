var Redis = require("ioredis");
var fs = require('fs');
var mapHelper = require("../helpers/mapHelper");

/**
 * Service which wraps a redis redis, allowing the calling of application-specific storage functions.
 *
 * TODO:
 * Download all data
 * Retrieve livestream status/information
 * Update livestream status/information
 * Check user/status in collection of current edit requests (hash of statusIds:username)
 * Add user/status to collection of current edit requests (hash of statusIds:username)
 * Remove user/status to collection of current edit requests (hash of statusIds:username)
 * Get all current edit requests collection (hash of statusIds:username)
 */
class StoreService {

    /**
     * Constructs a redis client. Also defines a command to push an element
     * on a list with an inserted status id.
     */
    constructor() {
        this.redis = new Redis();
        this.redis.defineCommand('rpushindex', {
            numberOfKeys: 2,
            lua: `
                local data = cjson.decode(ARGV[1])
                data[KEYS[2]] = redis.call("llen", KEYS[1])
                redis.call("rpush", KEYS[1], cjson.encode(data))
                return data[KEYS[2]]
            `
        });
    }

    /**
     * Logs a websocket event to Redis.
     *
     * Pushes the event into the `events` list in Redis, and also adds `timestamp` (ISO8601 datetime string)
     * property to the data.
     *
     * @param eventName {string} The namespace that the event occurred under.
     * @param data {*} The message to log.
     * @param user? {User} An optional user to append as the creator of the action.
     *
     * @returns {Promise} Returns a promise that resolves to an object containing
     * the id and insertion timestamp.
     */
    log(eventName, data, user) {
        return new Promise((resolve, reject) => {

            let timestamp = (new Date()).toISOString();

            this.redis.rpush("events", JSON.stringify({
                event: eventName,
                user: user ? user.username : null,
                timestamp: timestamp,
                body: data

            }), (err, response) => {
                return resolve({
                    id: response,
                    timestamp: timestamp
                });
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
                return this.redis.get("isActive", (err, reply) => resolve(reply === "true"));

            } else if (isAppActiveSetter === true || isAppActiveSetter === false) {
                this.redis.set("isActive", isAppActiveSetter);
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
                return this.redis.hgetall("launch", (err, reply) => {

                    if (reply != null) {
                        Object.keys(reply).forEach(key => {
                            reply[key] = JSON.parse(reply[key]);
                        });
                    }

                    return resolve(reply);
                });

            } else if (typeof launchProperty === "string") {
                return this.redis.hget("launch", launchProperty, (err, reply) => resolve(JSON.parse(reply)));

            }
            return reject();
        });
    }

    /**
     * Sets launch properties for the application.
     *
     * Inserts the keys and values of data as the keys and values of fields on the `launch` hash in Redis.
     * If dataObj is null or undefined the function will reject.
     *
     * @param data {*} An object of keys and values to be set on the `launch` hash in Redis.
     *
     * @returns {Promise} Returns a promise that resolves to the reply from Redis once the hash fields have been
     * set.
     */
    setLaunch(data) {
        return new Promise((resolve, reject) => {

            let obj = {};
            Object.keys(data).forEach(key => obj[key] = JSON.stringify(data[key]));

            if (data != null) {
                this.redis.hmset("launch", obj, (err, reply) => resolve(reply));
            } else {
                return reject();
            }
        });
    }

    getLivestream(livestreamKey) {

    }

    setLivestream(livestreamKey, data) {

    }

    /**
     * Retrieves all the launch statuses created so far from the application, and parses
     * them from an array of strings to an array of JSON objects.
     *
     * @returns {Promise} Resolves to the launch statuses created so far.
     */
    getLaunchStatuses() {
        return new Promise((resolve, reject) => {
            this.redis.lrange("launchStatuses", 0, -1, (err, statuses) => resolve(statuses.map(status => JSON.parse(status))));
        });
    }

    /**
     * Retrieves a single launch status from the launch statuses list, provided by the given
     * index passed to the function. The fetched launch status is parsed to a JSON object before
     * being returned.
     *
     * @param index {number} The index of the element to retrieve from the launch statuses list.
     *
     * @returns {Promise} Resolves to the launch status at the given index.
     */
    getLaunchStatus(index) {
        return new Promise((resolve, reject) => {
            this.redis.lindex("launchStatuses", index, (err, launchStatus) => resolve(JSON.parse(launchStatus)));
        });
    }

    /**
     * Sets a single launch status in the launchStatuses list at the index provided to the
     * data provided (which is JSON.stringified before being inserted). This essentially provides
     * an immutable edit functionality for existing launch statuses.
     *
     * @param index {number} The index of the element that should be changed.
     * @param data {*} JSON object of data that should be inserted at index.
     *
     * @returns {Promise} Resolves immediately.
     */
    setLaunchStatus(index, data) {
        return new Promise((resolve, reject) => {
            this.redis.lset('launchStatuses', index, JSON.stringify(data));
            resolve();
        });
    }

    /**
     * Adds a launch status to the launchStatuses list, pushing it onto the end, while also storing
     * its index in the property. This is accomplished via a custom redis lua script called 'RPUSHINDEX'.
     *
     * @param data {*} JSON launch status to store.
     *
     * @returns {Promise} Resolves to the index of insertion.
     */
    addLaunchStatus(data) {
        return new Promise((resolve, reject) => {
            this.redis.rpushindex("launchStatuses", "statusId", JSON.stringify(data), (err, index) => {
                resolve(index);
            });
        });
    }

    /**
     * Retrieves all the launch moment templates stored in redis. Additionally deserializes
     * each moment template.
     *
     * Firstly checks for the presence of the hash in Redis. If the hash does not exist, it
     * will reach from a known file where the launch moment templates can be found, and assigns
     * them to the hash. If the hash does exist, or once the former operation has been complete, it
     * returns all the moment templates.
     *
     * @returns {Promise<Map>} Resolves to a map of moment template objects.
     */
    getLaunchMomentTemplates() {
        return new Promise((resolve, reject) => {

            this.redis.hlen('launchMomentTemplates', (err, length) => {

                if (length === 0) {
                    fs.readFile('./launchmomenttemplates.json', 'utf8', (err, data) => {

                        let map = mapHelper.objectToMap(JSON.parse(data));
                        resolve(map);
                        this.setLaunchMomentTemplates(map)
                    });

                } else {
                    this.redis.hgetall('launchMomentTemplates', (err, templates) => {
                        Object.keys(templates).forEach(key => {
                            templates[key] = JSON.parse(templates[key]);
                        });

                        return resolve(mapHelper.objectToMap(templates));
                    });
                }
            });
        });
    }

    /**
     * For a given Map of launch moment templates in the data argument, serialize the JSON values,
     * and store them in redis.
     *
     * @param data {Map} A Map of one or more launch moment templates in JSON.
     *
     * @returns {Promise} Resolves to OK.
     */
    setLaunchMomentTemplates(data) {
        return new Promise((resolve, reject) => {

            let map = new Map();
            data.forEach((value, key) => map.set(key, JSON.stringify(value)));

            this.redis.hmset('launchMomentTemplates', map, (err, reply) => {
                return resolve(reply);
            });
        });
    }

    /**
     * Gets the value of the current viewers counter.
     *
     * @returns {Promise} Resolves to the current number of viewers.
     */
    getCurrentViewers() {
        return new Promise((resolve, reject) => {
            this.redis.get('currentViewers', (err, value) => resolve(value));
        });
    }

    /**
     * Increments the current viewers counter.
     *
     * @returns {Promise} Resolves to the new current number of viewers.
     */
    incrementCurrentViewers() {
        return new Promise((resolve, reject) => {
            this.redis.incr('currentViewers', (err, newValue) => resolve(newValue));
        });
    }

    /**
     * Decrements the current viewers counter.
     *
     * @returns {Promise} Resolves to the new current number of viewers.
     */
    decrementCurrentViewers() {
        return new Promise((resolve, reject) => {
            this.redis.decr('currentViewers', (err, newValue) => resolve(newValue));
        });
    }
}

module.exports = StoreService;