import {Injectable} from "@angular/core";
import {WebsocketService} from "./WebsocketService";
import {MomentTemplate} from "../Interfaces/MomentTemplate";
import {Livestream} from "../Interfaces/Livestream";


/**
 * Allows the sharing of application wide state data unrelated to the launch model.
 * @class
 */
@Injectable()
export class AppDataService {

    // Is the settings pane open?
    public isSettingsVisible: boolean = false;

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
        this.registerObservableListeners();
    }

    /**
     *
     */
    public registerObservableListeners() : void {
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

        this.websocketService.livestreamStatusesStream().subscribe(livestreams => {
            this.livestreams = livestreams;
        });
    }

    /**
     *
     * @returns {Livestream[]}
     */
    public availableLivestreams() : Livestream[] {
        return this.livestreams.filter(l => l.isAvailable);
    }
}