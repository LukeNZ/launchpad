import {Injectable} from "@angular/core";
import {AppDataService} from "./AppDataService";
import {Livestream} from "../Interfaces/Livestream";

/**
 * Service for sharing of user preferences data across the application, stored in local storeage.This includes data
 * such as livestream positioning, display modes, and user toggles.
 * @class
 */
@Injectable()
export class UserPreferencesService {
    // Localstorage options and user preferences
    private _textSize: string = window.localStorage.getItem("appData:textSize") || "normal";
    private _launchStatusDensity: string = window.localStorage.getItem("appData:launchStatusDensity") || "normal";
    private _notificationsPingEnabled: boolean = window.localStorage.getItem("appData:notificationsPing") === "true";
    private _acronymExpansionsDisabled: boolean = window.localStorage.getItem("appData:acronymExpansions") === "true";
    private _uiMode: string = window.localStorage.getItem("appData:uiMode") || "day";

    // Livestream user preferences
    // Order of visibility strings /does/ imply livestream order. The 0th livestream in this list should be treated
    // as the main livestream when nested.
    private _visibleLivestreams: string[] = JSON.parse(window.localStorage.getItem("appData:livestreams:enabled")) || ['SpaceX Hosted', 'SpaceX Technical', 'NASA'];

    // One of either "nested" or "linear"
    private _livestreamPositioningMode: string = window.localStorage.getItem("appData:livestreams:positioningMode") || "nested";

    constructor(private appData: AppDataService) {}

    /**
     * Returns the current text size user preference.
     *
     * @returns {string} Text size.
     */
    get textSize() : string {
        return this._textSize;
    }

    /**
     * Sets the text size of the application, saving the change to local storage for persistence.
     *
     * @param value {string} The value to set the text size to. One of `smaller`, `normal`, or `larger`.
     */
    set textSize(value: string) {
        this._textSize = value;
        window.localStorage.setItem("appData:textSize", value);
    }

    /**
     * Returns the current launch status density user preference.
     *
     * @returns {string} Launch status density.
     */
    get launchStatusDensity() : string {
        return this._launchStatusDensity;
    }

    /**
     * Sets the launch status density of the application, saving the change to local storage for persistence.
     *
     * @param value {string} The value to set the text size to. One of `compact`, `normal`, or `wide`.
     */
    set launchStatusDensity(value: string) {
        this._launchStatusDensity = value;
        window.localStorage.setItem("appData:launchStatusDensity", value);
    }

    /**
     * Returns the current user preference for notification pings.
     *
     * @returns {boolean} Notification ping preference..
     */
    get notificationsPingEnabled() : boolean {
        return this._notificationsPingEnabled;
    }

    /**
     * Sets whether notification pings are enabled, saving the change to local storage for persistence.
     *
     * @param value {boolean} Enable or disable notification pings.
     */
    set notificationsPingEnabled(value: boolean) {
        this._notificationsPingEnabled = value;
        window.localStorage.setItem("appData:notificationsPingEnabled", value.toString());
    }

    /**
     * Sets whether acronym expansions are disabled, saving the change to local storage for persistence.
     *
     * @param value {boolean} Enable or disable acronym expansions.
     */
    set acronymExpansionsDisabled(value: boolean) {
        this._acronymExpansionsDisabled = value;
        window.localStorage.setItem("appData:acronymExpansionsDisabled", value.toString());
    }

    /**
     * Sets the UI mode of the application, either daymode or nightmode.
     *
     * @param value {string} Either "day" or "night".
     */
    set uiMode(value: string) {
        this.uiMode = value;
        window.localStorage.setItem("appData:uiMode", value);
    }

    /**
     *
     * @returns {string[]}
     */
    get visibleLivestreams() : string[] {
        return this._visibleLivestreams;
    }

    /**
     *
     * @param value
     */
    set visibleLivestreams(value: string[]) {
        this._visibleLivestreams = value;
    }

    /**
     * Returns an array of visible livestreams, ordered by the order of the _visibleLivestreams string array field.
     *
     * @returns {Livestream[]}
     */
    public visibleLivestreamsAsLivestreams() : Livestream[] {
        return this.appData.availableLivestreams()
            .filter(l => this._visibleLivestreams.indexOf(l.name) != -1)
            .sort((a, b) => this._visibleLivestreams.indexOf(a.name) < this._visibleLivestreams.indexOf(b.name) ? -1 : 1);
    }

    /**
     * Returns the current livestream positioning mode the user has set. Is one of either 'nested' or 'linear'.
     *
     * @returns {string}
     */
    get livestreamPositioningMode() : string {
        return this._livestreamPositioningMode;
    }

    /**
     * Sets the livestream positioning mode of the application. Acceptable values are one of 'nested' or 'linear'.
     *
     * @param value {string} The positioning mode to set.
     */
    set livestreamPositioningMode(value: string) {
        this._livestreamPositioningMode = value;
    }

    /**
     * Finds the main livestream for the application. This is determined by taking the first element in the
     * _visibleLivestreams field, and finding a livestream object in the array that is returned by the
     * visibleLivestreams() method with a matching name.
     *
     * If there are no visible livestreams, null is returned.
     *
     * @returns {Livestream} The main livestream of the application.
     */
    public mainLivestream() : Livestream {
        if (this._visibleLivestreams.length > 0) {
            return this.visibleLivestreamsAsLivestreams().filter(l => l.name === this._visibleLivestreams[0])[0];
        }
        return null;
    }
}