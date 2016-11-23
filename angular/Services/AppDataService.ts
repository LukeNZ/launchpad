import {Injectable} from "@angular/core";

@Injectable()
/**
 * Allows the sharing of application wide state data unrelated to the launch model. This includes data
 * such as personal preferences stored in local storage, livestream positioning, and application states
 * such as settings visibility.
 * @class
 */
export class AppDataService {

    //
    public isSettingsVisible: boolean = false;

    // Application Mode
    public isActive: boolean;
}