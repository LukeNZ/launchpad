require('dotenv').config();
var fs = require('fs');
var jwt = require('jsonwebtoken');
var User = require("../models/User");

class AuthenticationService {

    constructor() {
        this.filename = './logins.txt';
    }

    /**
     * Checks a given login is valid by reading a login from the logins file, and checking the username and
     * password match.
     *
     * @param username The username of the user to check for.
     * @param password The password of the user to check for.
     *
     * @returns {Promise} A promise which resolves to a boolean, or rejects to an error.
     */
    isLoginValid(username, password) {
        return new Promise((resolve, reject) => {
            fs.readFile(this.filename, 'utf8', (err, data) => {
                if (err) reject(err);

                let user = data.split(/\r?\n/)
                    .map(user => {
                        let userArray = user.split(" ");
                        return new User(userArray[0], userArray[1], userArray.slice(2))
                    })
                    .find(user => {
                        return user.username == username && user.password == password;
                    });

                resolve(user != undefined);
            });
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
     * @returns User
     */
    getUser(token) {
        let decoded = jwt.verify(token, process.env.APP_KEY);

        fs.readFile(this.filename, 'utf8', (err, data) => {
            if (err) throw err;

            let user = data.split(/\r?\n/)
                .map(user => {
                    let userArray = user.split();
                    return new User(userArray[0], userArray[1], userArray.slice(2))
                })
                .find(user => user.username == decoded.payload.username);

            return user;
        });
    }
}

module.exports = AuthenticationService;