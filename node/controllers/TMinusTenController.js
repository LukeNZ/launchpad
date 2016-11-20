var path = require('path');
var Store = require('../services/StoreService');

class TMinusTenController {

    constructor() {
        this.store = new Store();
    }
    /**
     * Returns the current status of the TMinusTen application.
     * GET:/api/status
     *
     * @param request
     * @param response
     */
    getStatus(request, response) {
        this.store.isAppActive().then(activity => {
            response.send(JSON.stringify({
                isActive: activity
            }));
        }, () => {
           response.status(500).end();
        });
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
        this.store.getLaunch().then(launch => {
            response.send(launch);
        }, () => {
            response.status(500).end();
        })
    }
}

module.exports = TMinusTenController;