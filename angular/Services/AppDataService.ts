import {Injectable} from "@angular/core";
import {InitializationService} from "./InitializationService";
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
     * @param initializationService
     * @param websocketService
     */
    constructor(private initializationService: InitializationService, private websocketService: WebsocketService) {

        this.initializationService.getTMinusTen().subscribe(data => {
            this.isActive = data.isActive;
            if (!this.isActive) { this.isSettingsVisible = true; }
            this.isLoading = false;
        });
    }
}