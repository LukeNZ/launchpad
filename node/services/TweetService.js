var Twit = require('twit');

class TweetService {
    constructor() {
        this.twitter = new Twit({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            app_only_auth: true
        });
    }

}

module.exports = TweetService;