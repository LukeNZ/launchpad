import {Injectable} from "@angular/core";
import {Launch} from "../Classes/Launch";
import {Status} from "../Interfaces/Status";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {WebsocketService} from "./WebsocketService";

@Injectable()
/**
 * Service to allow the sharing of launch data across the application.
 * @class
 */
export class LaunchDataService {

    // Launch properties
    private _launch: Launch;
    private _launchSubject = new BehaviorSubject<Launch>(this._launch);
    private _launchObservable = this._launchSubject.asObservable();

    // Launch statuses and updates
    private _statuses: Status[] = [];
    private _statusesSubject = new BehaviorSubject<Status[]>(this._statuses);
    private _statusesObservable = this._statusesSubject.asObservable();

    /**
     *
     * @param websocketService
     */
    constructor(private websocketService: WebsocketService) {
        this.websocketService.launchStatusesStream().subscribe(websocket => {
            this.addStatus(websocket);
        });

        this.websocketService.launchStatusResponsesStream().subscribe(websocket => {
            this.addStatus(websocket.response);
        });

        this.websocketService.appStatusesStream().subscribe(websocket => {
            if (websocket.response.type === "enableApp") {
                this.setLaunch(Launch.create(websocket.data));
            }
        });

        this.websocketService.appStatusResponsesStream().subscribe(websocket => {
            console.log(websocket);
            if (websocket.response.type === "enableApp") {
                this.setLaunch(Launch.create(websocket.response.data));
            }
        });
    }

    /**
     * Sets the launch model of the service, and also sets the subject
     * for any subscribers listening for updates.
     *
     * @param launch {Launch} The new launch value.
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
     * Returns an observable for the launch model.
     *
     * @returns {Observable<Launch>} An observable of the launch model.
     */
    public launchObservable() : Observable<Launch> {
        return this._launchObservable;
    }

    /**
     * Sets the array of statuses.
     *
     * @param statuses {Status[]}
     */
    public setStatuses(statuses: Status[]) : void {
        this._statuses = statuses;
        this._statusesSubject.next(this._statuses);
    }

    /**
     * Pushes an status to the end of the statuses array.
     *
     * @param status {Status} The status to append to the end of the array.
     */
    public addStatus(status: Status) : void {
        this._statuses.push(status);
        this._statusesSubject.next(this._statuses);
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

    /**
     * Returns an observable for the array of statuses.
     *
     * @returns {Observable<Status[]>}
     */
    public statusesObservable() : Observable<Status[]> {
        return this._statusesObservable;
    }
}