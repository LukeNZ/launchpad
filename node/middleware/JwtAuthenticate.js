var jwt = require('jsonwebtoken');
var AuthenticationService = new require('./services/AuthenticationService')();

/**
 * Authenticates incoming ajax requests that require authorization to proceed by parsing and processing
 * the attached JSON Web Token.
 */
class JwtAuthenticate {

    construct() {
        this.authenticationService = new AuthenticationService();
    }

    /**
     *
     *
     * @param request
     * @param response
     * @param next
     *
     * @returns {*}
     */
    check(request, response, next) {
        // Ensure the request is an AJAX call or wants a JSON response.
        if (request.xhr || request.get('Content-Type') == "application/json") {

            let authHeader = request.get('Authorization');

            // Check for the presence of a header indicating a JWT.
            if (authHeader && this.getTokenStringFromHeader(authHeader) != null) {

                // Retrieve the token and check for correctness
                let tokenString = this.getTokenStringFromHeader(authHeader);
                if (this.authenticationService.isJsonWebTokenCorrect(tokenString)) {
                    next();
                }
            }
            return response.status(401).end();
        }
        next();
    }

    /**
     *
     *
     * @param header
     *
     * @returns {*}
     */
    getTokenStringFromHeader(header) {
        let tokenArray = header.split(" ");

        if (tokenArray.length == 2) {
            return tokenArray[1];
        }
        return null;
    }
}

module.exports = JwtAuthenticate;