import {Injectable} from "@angular/core";
import {WebsocketService} from "./WebsocketService";

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
    public isLoading: boolean = false;

    /**
     *
     * @param websocketService
     */
    constructor(private websocketService: WebsocketService) {

        this.websocketService.appStatusResponsesStream().subscribe(websocket => {
            if (websocket.response.statusType === "enableApp") {
                this.isActive = true;
                this.isSettingsVisible = false;
            }
        });

        this.websocketService.appStatusesStream().subscribe(websocket => {
            if (websocket.statusType === "enableApp") {
                this.isActive = true;
            }
        });
    }
}