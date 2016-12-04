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
    private _livestreamsVisible: string[] = JSON.parse(window.localStorage.getItem("appData:livestreams:enabled")) || ['SpaceX Hosted', 'SpaceX Technical', 'NASA'];
    private _livestreamPositioningMode: string = window.localStorage.getItem("appData:livestreams:positioningMode") || "nested";
    private _livestreamMainIfNested: string = window.localStorage.getItem("appData:livestreams:mainIfNested") || "SpaceX Hosted";

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
     * @returns {Livestream[]}
     */
    get visibleLivestreams() : Livestream[] {
        return this.appData.availableLivestreams().filter(l => this._livestreamsVisible.indexOf(l.name) != -1);
    }

    get livestreamPositioningMode() : string {
        return this._livestreamPositioningMode;
    }

    /**
     * Returns the main livestream when the application is in the nested display state.
     *
     * @returns {string} The main livestream.
     */
    get livestreamMainIfNested() : string {
        return this._livestreamMainIfNested;
    }

    /**
     * Sets the main livestream when the application is in the nested display state.
     *
     * @param value {string} the livestream name.
     */
    set livestreamMainIfNested(value: string) {
        if (typeof value === 'string') {
            this._livestreamMainIfNested = value;
            window.localStorage.setItem("appData:livestream:mainIfNested", value);
        }
    }
}