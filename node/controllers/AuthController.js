var AuthenticationService = require('../services/AuthenticationService');

class AuthController {

    constructor() {
        this.authenticationService = new AuthenticationService();
    }

    /**
     * Logs a user in to T Minus Ten. If successful, provides a JSON Web Token to the client on success.
     *
     * @param request
     * @param response
     * Returns 204 No Content if the operation completed successfully.
     * Returns 422 Unprocessable Entity if the login was invalid.
     */
    login(request, response) {
        this.authenticationService.getJsonWebToken(request.body.username, request.body.password).then(token => {
            response.set('Authorization', `bearer ${token}`);
            response.status(204).end();
        }, error => {
            response.status(422).end();
        });
    }
}

module.exports = AuthController;