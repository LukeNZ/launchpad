const fs = require('fs');
const snoowrap = require('snoowrap');
const dot = require('dot');
require('dotenv').config();
var StoreService = require('../services/StoreService');

/**
 * @class
 */
class RedditService {

    constructor() {
        // Cached template for quick reconstruction
        this.template = null;

        // Subreddit to submit to
        this.subreddit = process.env.SUBREDDIT;

        // Register a reddit snoowrap instance
        this.r = new snoowrap({
            userAgent: process.env.REDDIT_USER_AGENT,
            clientId: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET,
            username: process.env.REDDIT_USERNAME,
            password: process.env.REDDIT_PASSWORD,
        });

        // Preserve whitespace
        dot.templateSettings.strip = false;

        this.store = new StoreService();
    }

    /**
     * Creates a reddit selfpost thread, in the subreddit specified in the application's environment settings,
     * with the thread title determined by the launch name. The thread is created with prefilled data.
     *
     * @returns {Promise} Fulfills when the request completes successfully. Rejects if an error is encountered.
     */
    createThread() {
        return new Promise((resolve, reject) => {
            // Fetch redis data
            Promise.all([
                this.store.getLaunch(),
                this.store.getLivestreams()
            ])
            .then(data => {
                // Render the template and create the title.
                return Promise.all([
                    `r/SpaceX ${data[0].name} Official Launch Discussion & Updates Thread`,
                    this.render({
                        launch: data[0],
                        livestreams: data[1],
                        launchStatuses: []
                    })
                ]);
            })
            .then(data => this.submitToReddit(data))
            .then(submission => {
                // Store thread id
                return this.store.setRedditThreadId(submission.id);
            })
            .then(okay => resolve(okay))
            .catch(err => reject(err));
        });
    }

    /**
     * Edits the current reddit selfpost with updated data.
     *
     * @returns {Promise} Resolves if the operation completes successfully, rejects if otherwise.
     */
    editThread() {
        // Fetch redis data
        return Promise.all([
            this.store.getLaunch(),
            this.store.getLivestreams(),
            this.store.getLaunchStatuses()
        ])
        .then(data => {
            return Promise.all([
                this.render({
                    launch: data[0],
                    livestreams: data[1],
                    launchStatuses: data[2]
                }),
                this.store.getRedditThreadId()
            ]);
        })
        .then(data => this.editReddit(data))
        .then(okay => resolve(okay))
        .catch(err => reject(err));
    }

    /**
     * @internal
     * @param data
     * @returns {Promise}
     */
    submitToReddit(data) {
        return this.r.getSubreddit(this.subreddit).submitSelfpost({
            title: data[0],
            text: data[1],
            sendReplies: false
        });
    }

    /**
     *
     * @internal
     * @param data
     * @returns {Promise}
     */
    editReddit(data) {
        return this.r.getSubmission(data[1]).edit(data[0]);
    }

    /**
     * @internal
     * @param values
     * @returns {Promise}
     */
    render(values) {
        return new Promise((resolve, reject) => {

            if (this.template) {
                let templateFn = dot.template(this.template);
                return resolve(templateFn(values));

            } else {
                fs.readFile('./files/launch-thread.md', 'utf8', (err, data) => {
                    this.template = data;

                    let templateFn = dot.template(this.template);
                    return resolve(templateFn(values));
                });
            }
        });
    }
}

module.exports = RedditService;