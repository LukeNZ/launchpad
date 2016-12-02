const Redis = require("ioredis");
const fs = require('fs');

/**
 * Service which wraps a redis redis, allowing the calling of application-specific storage functions.
 *
 * TODO:
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
     * the function will reject. If the launchProperty is an array of strings, all hashes will be returned.
     *
     * @param propertyOrProperties {undefined|string|string[]} Optional argument, that if set will return
     * only that field from the launch hash.
     *
     * @returns {Promise} Returns a promise that resolves to the launch hash or specific hash field.
     */
    getLaunch(propertyOrProperties) {
        return new Promise((resolve, reject) => {
            if (propertyOrProperties == undefined) {
                return this.redis.hgetall("launch", (err, reply) => resolve(this.transformOutput(reply)));

            } else if (Array.isArray(propertyOrProperties)) {
                return this.redis.hmget("launch", propertyOrProperties, (err, reply) =>
                {
                    resolve(this.transformOutput(reply));
                });

            } else if (typeof propertyOrProperties === "string") {
                return this.redis.hget("launch", propertyOrProperties, (err, reply) => {
                    resolve(this.transformOutput(reply))
                });
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

            let obj = this.transformInput(data);

            if (data != null) {
                this.redis.hmset("launch", obj, (err, reply) => resolve(reply));
            } else {
                return reject();
            }
        });
    }

    /**
     *
     *
     * @returns {Promise}
     */
    getLivestreams() {
        return new Promise((resolve, reject) => {

            this.redis.hlen('livestreams', (err, length) => {

                if (length === 0) {
                    fs.readFile('./files/livestreams.json', 'utf8', (err, data) => {

                        data = JSON.parse(data);
                        this.setLivestreams(data);
                        resolve(data);
                    });

                } else {
                    this.redis.hgetall('livestreams', (err, livestreams) => {
                        return resolve(this.objectToArray(this.transformOutput(livestreams)));
                    });
                }
            });
        });
    }

    /**
     *
     * @param data
     *
     * @returns {Promise} Resolves to ok.
     */
    setLivestreams(data) {
        return new Promise((resolve, reject) => {
            let obj = this.transformInput(this.arrayToObject(data, "name"));
            this.redis.hmset('livestreams', obj, (err, reply) => resolve(reply));
        });
    }

    /**
     * Retrieves all the launch statuses created so far from the application, and parses
     * them from an array of strings to an array of JSON objects.
     *
     * @returns {Promise} Resolves to the launch statuses created so far.
     */
    getLaunchStatuses() {
        return new Promise((resolve, reject) => {
            this.redis.lrange("launchStatuses", 0, -1, (err, statuses) => resolve(this.transformOutput(statuses)));
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
            this.redis.lindex("launchStatuses", index, (err, status) => resolve(this.transformOutput(status)));
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
            this.redis.rpushindex("launchStatuses", "statusId", JSON.stringify(data), (err, index) => resolve(index));
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
     * @returns {Promise} Resolves to an object of moment template objects.
     */
    getLaunchMomentTemplates() {
        return new Promise((resolve, reject) => {

            this.redis.hlen('launchMomentTemplates', (err, length) => {

                if (length === 0) {
                    fs.readFile('./files/launch-moment-templates.json', 'utf8', (err, data) => {

                        data = JSON.parse(data);
                        this.setLaunchMomentTemplates(data);
                        resolve(data);
                    });

                } else {
                    this.redis.hgetall('launchMomentTemplates', (err, templates) => {
                        return resolve(this.objectToArray(this.transformOutput(templates)));
                    });
                }
            });
        });
    }

    /**
     * For a given array of launch moment templates in the data argument, serialize the JSON values,
     * and store them in redis.
     *
     * @param data {[]} Array of  launch templates.
     *
     * @returns {Promise} Resolves to OK.
     */
    setLaunchMomentTemplates(data) {
        return new Promise((resolve, reject) => {
            let obj = this.transformInput(this.arrayToObject(data, "title"));
            this.redis.hmset('launchMomentTemplates', obj, (err, reply) => resolve(reply));
        });
    }

    /**
     * Gets the reddit thread id.
     *
     * @returns {Promise} Resolves to the id of the created reddit thread.
     */
    getRedditThreadId() {
        return new Promise((resolve, reject) => {
            this.redis.get('redditThreadId', (err, reply) => resolve(reply));
        });
    }

    /**
     * Sets the reddit thread id.
     *
     * @param data {string} The id of the reddit thread.
     *
     * @returns {Promise} Resolves to ok.
     */
    setRedditThreadId(data) {
        return new Promise((resolve, reject) => {
            this.redis.set('redditThreadId', data, (err, reply) => resolve(reply));
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

    /**
     * Returns all logged events.
     *
     * @returns {Promise} Resolves to all the events logged in the application.
     */
    getLogs() {
        return new Promise((resolve, reject) => {
            this.redis.lrange("events", 0, -1, (err, data) => resolve(data));
        });
    }

    /**
     * Transforms the input data from JSON to a string..
     * @internal
     *
     * @param data {Object} Input data to transform.
     *
     * @returns {string} Stringified data.
     */
    transformInput(data) {
        let transformedData = {};

        if (Array.isArray(data)) {
            transformedData = data.map(element => JSON.stringify(element));

        } else if (typeof data === "object") {
            Object.keys(data).forEach(key => transformedData[key] = JSON.stringify(data[key]));

        } else {
            transformedData = JSON.stringify(data);
        }

        return transformedData;
    }

    /**
     * Transforms output data from a string into JSON by parsing it.
     *
     * @param data {string} Output data to transform.
     *
     * @returns {*} JSON output.
     */
    transformOutput(data) {
        if (Array.isArray(data)) {
            return data.map(element => JSON.parse(element));

        } else if (typeof data === "object") {
            Object.keys(data).forEach(key => data[key] = JSON.parse(data[key]));
            return data;

        } else {
            return JSON.parse(data);
        }
    }

    /**
     *
     * @param array
     * @param key
     *
     * @returns {Object}
     */
    arrayToObject(array, key) {
        let obj = {};
        array.forEach(el => {
            obj[el[key].replace(/\s+/g, '')] = el;
        });
        return obj;
    }

    /**
     *
     * @param object
     *
     * @returns {Array}
     */
    objectToArray(object) {
        return Object.keys(object).map(key => object[key]);
    }

}

module.exports = StoreService;