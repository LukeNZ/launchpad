var path = require('path');
var Store = require('../services/StoreService');

class TMinusTenController {

    constructor() {
        this.store = new Store();
    }
    /**
     * Returns the current status of the TMinusTen application.
     * GET:/api/tminusten
     *
     * @param request
     * @param response
     */
    getTMinusTen(request, response) {
        this.store.isAppActive().then(activity => {
            response.json({
                isActive: activity
            });
        }, () => {
           response.status(500).end();
        });
    }

    /**
     * Returns the currently posted statuses.
     * GET:/api/statuses
     *
     * @param request
     * @param response
     */
    getStatuses(request, response) {
        this.store.getLaunchStatuses().then(statuses => {
            response.json(statuses);
        });
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
            response.json(launch);
        }, () => {
            response.status(500).end();
        })
    }
}

module.exports = TMinusTenController;