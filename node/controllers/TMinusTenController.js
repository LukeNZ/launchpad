var path = require('path');

class TMinusTenController {
    /**
     * Returns the current status of the TMinusTen application.
     * GET:/api/status
     *
     * @param request
     * @param response
     */
    getStatus(request, response) {
        response.send(JSON.stringify({
            isActive: false
        }));
    }

    /**
     * Returns the currently posted updates.
     * GET:/api/updates
     *
     * @param request
     * @param response
     */
    getUpdates(request, response) {
        response.send();
    }

    /**
     * Returns the current launch data.
     * GET:/api/launch
     *
     * @param request
     * @param response
     */
    getLaunch(request, response) {
        response.send();
    }
}

module.exports = TMinusTenController;