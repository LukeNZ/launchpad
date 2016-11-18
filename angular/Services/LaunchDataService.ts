import {Injectable} from "@angular/core";
import {Launch} from "../Classes/Launch";
import {Update} from "../Interfaces/Update";

@Injectable()
export class LaunchDataService {
    private _launch: Launch;
    private _updates: Update[];

    public isActive: boolean;

    /**
     * Sets the launch model of the service.
     *
     * @param launch
     */
    public setLaunch(launch: Launch) : void {
        this._launch = launch;
    }

    /**
     * Accessor for the launch model.
     *
     * @returns {Launch}
     */
    get launch() : Launch {
        return this._launch;
    }

    /**
     * Sets the array of updates.
     *
     * @param updates
     */
    public setUpdates(updates: Update[]) : void {
        this._updates = updates;
    }

    /**
     * Pushes an update to the end of the updates array.
     *
     * @param update The update to append to the end of the array.
     */
    public addUpdate(update: Update) : void {
        if (!this._updates) {
            this._updates = [];
        }
        this._updates.push(update);
    }

    /**
     * Deletes an update from the updates array.
     *
     * @param update
     *
     * @returns {boolean} True if the update was deleted, false if the update was not deleted.
     */
    public deleteUpdate(update: Update) : boolean {
        let index = this._updates.indexOf(update);
        if (index > -1) {
            this._updates.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Accessor for updates.
     *
     * @returns {Update[]}
     */
    get updates() : Update[] {
        return this._updates;
    }
}