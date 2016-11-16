import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
var io = require('socket.io-client');

@Injectable()
export class WebsocketService {
    public socket = null;

    constructor() {
        this.socket = io.connect("localhost:3001");
    }

    /**
     *
     * @param typingStatus
     */
    public emitTypingStatus(typingStatus : boolean) : void {
        this.socket.emit("typingStatus", typingStatus);
    }

    /**
     *
     * @param launchUpdate
     */
    public emitCreateLaunchUpdate(launchUpdate : string) : void {
        this.socket.emit("launchUpdate", launchUpdate);
    }

    public emitEditLaunchUpdate(launchUpdateEdit: any) : void {

    }

    public emitDeleteLaunchUpdate(launchUpdateDeletion: any) : void {

    }

    /**
     *
     * @param launchStatus
     */
    public emitLaunchStatus(launchStatus: string) : void {
        this.socket.emit("launchStatus", launchStatus);
    }

    /**
     *
     * @param statusType
     * @param data
     */
    public emitAppStatus(statusType: string, data? : any) : void {

        if (!data) {
            data = {};
        }

        console.log('called');

        this.socket.emit("appStatus", {
            user: "foo",
            key: "bar",
            statusType: statusType,
            data: data
        });
    }

    /**
     *
     * @returns {Observable}
     */
    public launchUpdatesStream() : Observable<any> {
        return new Observable(observer => {

            this.socket.on('launchUpdate', data => observer.next(data));
            return () => this.socket.disconnect();
        });
    }

    /**
     *
     * @returns {Observable}
     */
    public launchStatusesStream() : Observable<any> {
        return new Observable(observer => {

            this.socket.on('launchStatus', data => observer.next(data));
            return () => this.socket.disconnect();
        });
    }

    /**
     *
     */
    //public appStatusesStream() : Observable<any> {

    //}

}