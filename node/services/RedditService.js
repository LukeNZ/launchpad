const fs = require('fs');
const snoowrap = require('snoowrap');
const dot = require('dot');
require('dotenv').config();
var StoreService = require('../services/StoreService');

class RedditService {

    constructor() {
        this.subreddit = process.env.SUBREDDIT;

        this.template = null;

        this.r = new snoowrap({
            userAgent: process.env.REDDIT_USER_AGENT,
            clientId: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET,
            username: process.env.REDDIT_USERNAME,
            password: process.env.REDDIT_PASSWORD,
        });

        this.store = new StoreService();
    }

    /**
     * Creates a reddit selfpost thread, in the subreddit specified in the constructor argument, with
     * the title determined by the launch name. The thread is created with prefilled data based on the
     * launch and livestream hashes from the Redis store.
     */
    createThread() {
        // Fetch redis data
        Promise.all([
            this.store.getLaunch(),
            this.store.getLivestreams()

        ]).then(data => {
            // Render the template
            this.render({
                launch: data[0],
                livestreams: data[1],
                launchStatuses: []
            }).then(templateResult => {
                // Submit to reddit
                this.r.getSubreddit(this.subreddit).submitSelfpost(
                    {
                        title: `r/SpaceX ${this.launch.name} Official Launch Discussion & Updates Thread`,
                        text: templateResult
                    }
                ).then(submission => {
                    // Store thread id
                    this.store.setRedditThreadId(submission.id);
                });
            }, err => console.log(err));
        });
    }

    /**
     * Edits the current reddit selfpost with updated data.
     */
    editThread() {
        // Fetch redis data
        Promise.all([
            this.store.getLaunch(),
            this.store.getLivestreams(),
            this.store.getLaunchStatuses()
        ]).then(data => {

            Promise.all([
                this.render({
                    launch: data[0],
                    livestreams: data[1],
                    launchStatuses: data[2]
                }),
                this.store.getRedditThreadId()
            ]).then(templateResultAndSubmissionId => {

                this.r.getSubmission(templateResultAndSubmissionId[1])
                    .edit(templateResultAndSubmissionId[0]);
            });
        });
    }

    /**
     * @private
     */
    render(values) {
        return new Promise((resolve, reject) => {

            if (this.template) {
                let templateFn = dot.template(this.template);
                return resolve(templateFn(values));

            } else {
                fs.readFile('./launch-thread.md', 'utf8', (err, data) => {
                    this.template = data;

                    let templateFn = dot.template(this.template);
                    let val = templateFn(values);
                    return resolve(val);
                });
            }
        });
    }
}

module.exports = RedditService;