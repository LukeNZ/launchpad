import {Injectable} from "@angular/core";
import {WebsocketService} from "./WebsocketService";
import {MomentTemplate} from "../Interfaces/MomentTemplate";
import {Livestream} from "../Interfaces/Livestream";

@Injectable()
/**
 * Allows the sharing of application wide state data unrelated to the launch model. This includes data
 * such as personal preferences stored in local storage, livestream positioning, and application states
 * such as settings visibility.
 * @class
 */
export class AppDataService {

    // Is the settings pane open?
    public isSettingsVisible: boolean = false;

    // Localstorage options and user preferences
    private _textSize: string = window.localStorage.getItem("appData:textSize") || "normal";
    private _launchStatusDensity: string = window.localStorage.getItem("appData:launchStatusDensity") || "normal";
    private _notificationsPingEnabled: boolean = window.localStorage.getItem("appData:notificationsPing") === "true";
    private _acronymExpansionsDisabled: boolean = window.localStorage.getItem("appData:acronymExpansions") === "true";

    // Application Mode
    public isActive: boolean;
    public isLoading: boolean = true;

    // Launch Moment Templates
    public launchMomentTemplates: MomentTemplate[];

    // Livestream Data
    public livestreams: Livestream[];

    /**
     *
     * @param websocketService
     */
    constructor(private websocketService: WebsocketService) {

        this.websocketService.appStatusesStream().subscribe(websocket => {
            if (websocket.type === "enableApp") {
                this.isActive = true;
            }

            if (websocket.response.type === "editMoments") {
                this.launchMomentTemplates = websocket.response.launchMomentTemplates;
            }

            if (websocket.response.type === "disableApp") {
                this.isActive = false;
            }
        });

        this.websocketService.appStatusResponsesStream().subscribe(websocket => {
            if (websocket.response.type === "enableApp") {
                if (websocket.responseCode === 200) {
                    this.isActive = true;
                    this.isSettingsVisible = false;
                }
            }

            if (websocket.response.type === "editMoments") {
                this.launchMomentTemplates = websocket.response.launchMomentTemplates;
            }

            if (websocket.response.type === "disableApp") {
                this.isActive = false;
            }
        });
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
     * Sets the launch status density of the application, saving the change to local storage for persistence.
     *
     * @param value {string} The value to set the text size to. One of `compact`, `normal`, or `wide`.
     */
    set launchStatusDensity(value: string) {
        this._launchStatusDensity = value;
        window.localStorage.setItem("appData:launchStatusDensity", value);
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
}