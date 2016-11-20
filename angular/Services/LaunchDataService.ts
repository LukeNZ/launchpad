import {Injectable} from "@angular/core";
import {Launch} from "../Classes/Launch";
import {Status} from "../Interfaces/Status";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class LaunchDataService {
    private _launch: Launch;
    private _launchSubject = new BehaviorSubject<Launch>(this._launch);
    private _launchObservable = this._launchSubject.asObservable;

    private _statuses: Status[];

    public isActive: boolean;

    /**
     * Sets the launch model of the service, and also sets the subject
     * for any subscribers listening for updates.
     *
     * @param launch    The new launch value.
     */
    public setLaunch(launch: Launch) : void {
        this._launch = launch;
        this._launchSubject.next(launch);
    }

    /**
     * Plain accessor for the launch model.
     *
     * @returns {Launch} The launch model.
     */
    get launch() : Launch {
        return this._launch;
    }

    /**
     * Returns an observable for the launch model
     *
     * @returns {Observable<Launch>} An observable of the launch model.
     */
    public launchObservable() : Observable<Launch> {
        return this._launchObservable();
    }

    /**
     * Sets the array of statuses.
     *
     * @param statuses
     */
    public setStatuses(statuses: Status[]) : void {
        this._statuses = statuses;
    }

    /**
     * Pushes an status to the end of the updates array.
     *
     * @param status {Status} The status to append to the end of the array.
     */
    public addStatus(status: Status) : void {
        if (!this._statuses) {
            this._statuses = [];
        }
        this._statuses.push(status);
    }

    /**
     * Deletes an status from the updates array.
     *
     * @param status {Status}
     *
     * @returns {boolean} True if the status was deleted, false if the status was not deleted.
     */
    public deleteStatus(status: Status) : boolean {
        let index = this._statuses.indexOf(status);
        if (index > -1) {
            this.setStatuses(this._statuses.splice(index, 1));
            return true;
        }
        return false;
    }

    /**
     * Accessor for updates.
     *
     * @returns {Status[]}
     */
    get statuses() : Status[] {
        return this._statuses;
    }
}