require('dotenv').config();
var fs = require('fs');
var jwt = require('jsonwebtoken');
var User = require("../models/User");

/**
 * Manages application authentication through JSON Web Tokens, ensures users have the correct
 * roles to perform actions.
 */
class AuthenticationService {

    constructor() {
        this.filename = './logins.json';
        this.cache = [];
    }

    /**
     * Checks a given login is valid by checking the username and password against a list of users.
     * Preferentially checks an array of users before reading the users file.
     *
     * @param username The username of the user to check for.
     * @param password The password of the user to check for.
     *
     * @returns {Promise} A promise which resolves to a boolean, or rejects to an error.
     */
    isLoginValid(username, password) {
        return new Promise((resolve, reject) => {

            if (this.cache.length > 0) {
                let user = this.cache.find(user => user.username == username && user.password == password);
                resolve(user != undefined);

            } else {
                fs.readFile(this.filename, 'utf8', (err, data) => {
                    if (err) reject(err);

                    this.cache = JSON.parse(data).map(user => new User(user.username, user.password, user.permissions));

                    let user = this.cache.find(user => user.username == username && user.password == password);
                    resolve(user != undefined);
                });
            }
        });
    }

    /**
     * Provided with a valid email and password, returns a JSON Web Token representing a successful
     * login claim that the client may provide to the server to act as authentication for future
     * requests.
     *
     * @param username string The email address of the claim.
     * @param password string The password of the claim.
     *
     * @returns {Promise}
     */
    getJsonWebToken(username, password) {
        return new Promise((resolve, reject) => {
            this.isLoginValid(username, password).then(isValid => {
                if (isValid) {
                    return resolve(jwt.sign({
                        username: username
                    }, process.env.APP_KEY, {
                        issuer: 'http://rpsacex.com/',
                        audience: 'http://rspacex.com/'
                    }));
                }
                return reject();
            });
        });
    }

    /**
     * Checks if the token provided is correct.
     *
     * @param token The token string to check correctness for.
     *
     * @returns {boolean} Whether the token is correct.
     */
    isJsonWebTokenCorrect(token) {
        try {
            let decoded = jwt.verify(token, process.env.APP_KEY);
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Gets the user from the token.
     *
     * @param token
     *
     * @returns Promise
     */
    getUser(token) {
        let decoded = jwt.verify(token, process.env.APP_KEY);

        return new Promise((resolve, reject) => {

            if (this.cache.length > 0) {
                resolve(this.cache.find(user => user.username == decoded.username));

            } else {
                fs.readFile(this.filename, 'utf8', (err, data) => {
                    if (err) reject(err);

                    this.cache = JSON.parse(data).map(user => new User(user.username, user.password, user.permissions));
                    resolve(this.cache.find(user => user.username == decoded.username));
                });
            }
        });
    }

    /**
     * All-up method to check that a user has the provided permission. If the user does not have permission, if
     * the user does not exist, if a token is incorrect, or no token exists, this promise will reject.
     *
     * @param permission
     * @param token
     *
     * @returns {Promise}   Resolves if a user has the stated permission, rejects for any other reason.
     */
    userHasPermission(permission, token) {
        return new Promise((resolve, reject) => {
            if (!token || !this.isJsonWebTokenCorrect(token)) {
                return reject();
            }
            this.getUser(token).then(user => {
                if (!user || !user.permissions.includes(permission)) {
                    return reject();
                }
                return resolve();
            });
        });
    }
}

module.exports = AuthenticationService;