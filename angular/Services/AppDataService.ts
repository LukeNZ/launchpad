import {Injectable} from "@angular/core";
import {WebsocketService} from "./WebsocketService";
import {MomentTemplate} from "../Interfaces/MomentTemplate";

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

    // Application Mode
    public isActive: boolean;
    public isLoading: boolean = true;

    // Launch Moment Templates
    public launchMomentTemplates: [string, MomentTemplate][];

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
                this.isActive = true;
                this.isSettingsVisible = false;
            }

            if (websocket.response.type === "editMoments") {
                this.launchMomentTemplates = websocket.response.launchMomentTemplates;
            }

            if (websocket.response.type === "disableApp") {
                this.isActive = false;
            }
        });
    }
}