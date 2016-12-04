const https = require('https');
var Store = require('./StoreService');

/**
 * @class
 */
class LivestreamService {

    constructor(websocketController) {
        this.websocketController = websocketController;
        this.store = new Store();

        // https://developers.google.com/youtube/v3/docs/channels/list#try-it
        this.channels = {
            spacex: {
                name: 'spacexchannel',
                id: 'UCtI0Hodo5o5dUb67FeUjDeA'
            },
            nasa: {
                name: 'NASAtelevision',
                id: 'UCLA_DiR1FfKNvjuUpBHmylQ'
            }
        };
    }

    /**
     * Starts the monitoring of YouTube livestreams at a frequency of once every 2 minutes.
     */
    run() {
        let twoMinutes = 1000 * 60 * 2;
        this.id = setInterval(this.check, twoMinutes);
    }

    /**
     * Stops the monitoring of YouTube livestreams.
     */
    stop() {
        clearInterval(this.id);
    }

    /**
     * Checks if there are changes in the livestream data, between what is fetched, and what we are storing. If there
     * are differences, will update the livestream data and tell a webcastStatus websocket event to be sent.
     *
     * Is called every two minutes via a setInterval function when run() is invoked, but can also be called standalone
     * for initialization purposes.
     *
     * Note that most of the time, this function will indeed discover there are differences between the stored livestream
     * data and the current livestream data, as the viewers of each stream will constantly fluctuate.
     */
    check() {
        let oldLivestreamData;

        this.store.getLivestreams()
        // Assign the livestream data to a more broadly accessible variable, and request YouTube search API data.
        .then(livestreams => {
            oldLivestreamData = livestreams;

            let spacexUpcoming = this.makeHttpsRequest(this.youtubeSearchApiRequestFormatter(this.channels.spacex.id, "upcoming"));
            let spacexLive = this.makeHttpsRequest(this.youtubeSearchApiRequestFormatter(this.channels.spacex.id, "live"));
            let nasaLive = this.makeHttpsRequest(this.youtubeSearchApiRequestFormatter(this.channels.nasa.id, "live"));

            return Promise.all([
                spacexUpcoming, spacexLive, nasaLive
            ]);
        })
        // Manipulate the YouTube search responses into appropriate data
        .then(searchResponses => {
            let videoIds = searchResponses
                // Filter to remove search responses with no results
                .filter(searchResponse => searchResponse.pageInfo.totalResults > 0)
                // Reduce the array of returned items into a single array
                .reduce((acc, searchResponse) => {
                    return acc.concat(searchResponse.items);
                }, [])
                // Return only items we are interested in (all spacex streams and the public NASA stream)
                .filter(item => {
                    return item.snippet.channelId === this.channels.spacex.id
                        || item.snippet.title === "NASA TV Public-Education";
                })
                .map(item => {
                    return item.id.videoId;
                })
                .join(",");

            return this.makeHttpsRequest(this.youtubeVideoApiRequestFormatter(videoIds));
        })
        // Manipulate the video responses into a similar structure as we store it
        .then(videoResponse => {
            let newLivestreamObject = videoResponse.items
                .map(livestream => {
                    return {
                        name: this.getLivestreamName(livestream),
                        url: `https://youtube.com/embed/${livestream.id}?modestbranding=1&showinfo=0`,
                        viewers: livestream.liveStreamingDetails.concurrentViewers,
                        isAvailable: oldLivestreamData[this.getLivestreamName(livestream)].isAvailable,
                        status: livestream.snippet.liveBroadcastContent
                    };
                })
                // Redis stores hashes as objects, lets convert our array to an objected keyed by
                // livestream name
                .reduce((acc, v) => {
                    acc[v.name.replace(/\s+/g, '')] = v;
                }, {});

            return Promise.all([
                newLivestreamObject,
                this.store.getLivestreams()
            ]);
        })
        // Compare the objects' properties to see if any have changed.
        .then(livestreamObjects => {
            let result = this.isDifferent(livestreamObjects[0], livestreamObjects[1]);

            if (result) {
                // Save to redis
                this.store.log("msg:webcastStatus", livestreamObjects[0]);
                this.store.setLivestreams(livestreamObjects[0]);
                // Broadcast
                this.websocketController.webcastStatus(livestreamObjects[0])
            }
        })
        .catch(err => console.log("exiting..."));
    }

    /**
     * Compares if two objects share the same property values.
     * @internal
     *
     * @param a {Object}
     * @param b {Object}
     *
     * @returns boolean
     */
    isDifferent(a, b) {
        for (let prop in a) {
            if (a.hasOwnProperty(prop) && b.hasOwnProperty(prop)) {
                if (a[prop] !== b[prop]) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Makes an HTTPS get request to the specified resource. See https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/
     * for source.
     * @internal
     *
     * @param url {string} The URL of the resource.
     *
     * @returns {Promise} Resolves on completion, rejects otherwise.
     */
    makeHttpsRequest(url) {
        return new Promise((resolve, reject) => {
            let request = https.get(url, reponse => {
                if (response.statusCode !== 200) {
                    reject(response.statusCode);
                }

                let body = [];
                response.on('data', chunk => body.push(chunk));
                response.on('end', () => resolve(body.join('')));
            });
            request.on('error', err => reject(err));
        });
    }

    /**
     * For a given livestream JSON object, determine the name of the stream.
     * @internal
     *
     * @param livestream {Object} Determine the name of the stream from this object.
     * @returns {string} The stream name.
     */
    getLivestreamName(livestream) {
        if (livestream.channelId === this.channels.nasa.id) {
            return "NASA";
        } else {
            if (livestream.snippet.title.indexOf("Hosted") != -1) {
                return "SpaceX Hosted";
            } else if (livestream.snippet.title.indexOf("Technical") != -1) {
                return "SpaceX Technical";
            }
        }
    }

    /**
     * Formats a url for a Youtube Search API request, accepting a channel id and the event type.
     * @internal
     *
     * @param channelId {string} The channel ID to limit the search to.
     * @param eventType {string} The event type to search for, either `upcoming` or `live`.
     *
     * @returns {string} The formed URL.
     */
    youtubeSearchApiRequestFormatter(channelId, eventType) {
        return `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=${eventType}&type=video&key=${process.env.YOUTUBE_KEY}`;
    }

    /**
     * Forms a url for a YouTube Video List API request, accepting a string of joined videos ids.
     * @internal
     *
     * @param videoIds {string} Comma-separated video IDs.
     *
     * @returns {string} The formed URL.
     */
    youtubeVideoApiRequestFormatter(videoIds) {
        return `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${videoIds}&key=${process.env.YOUTUBE_KEY}`;
    }
}

module.exports = LivestreamService;