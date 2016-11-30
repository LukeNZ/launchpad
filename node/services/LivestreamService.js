var request = require('request');

/**
 * @class
 */
class LivestreamService {

    constructor(websocketController) {
        this.websocketController = websocketController;

        this.channelName = 'spacexchannel';
        this.channelId = 'UCtI0Hodo5o5dUb67FeUjDeA'; // https://developers.google.com/youtube/v3/docs/channels/list#try-it
    }

    /**
     * Starts the moritoring of YouTube livestreams at a frequency of once per minute.
     */
    run() {
        let oneMinute = 1000 * 60;
        this.id = setInterval(this.check, oneMinute);
    }

    /**
     * Stops the monitoring of YouTube livestreams.
     */
    stop() {
        clearInterval(this.id);
    }

    check() {
        return new Promise((resolve, reject) => {
            request(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=`)
        });
    }
}

module.exports = LivestreamService;