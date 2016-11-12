import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
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
     * @param appStatus
     */
    public emitAppStatus(appStatus: string) : void {
        this.socket.emit("appStatus", appStatus);
    }

    /**
     *
     * @returns {Observable}
     */
    public launchUpdatesStream() : Observable<any> {
        let observable = new Observable(observer => {

            this.socket.on('launchUpdate', data => observer.next(data));
            return () => this.socket.disconnect();
        });

        return observable;
    }

    /**
     *
     * @returns {Observable}
     */
    public launchStatusesStream() : Observable<any> {
        let observable = new Observable(observer => {

            this.socket.on('launchStatus', data => observer.next(data));
            return () => this.socket.disconnect();
        });

        return observable;
    }

    /**
     *
     */
    public appStatusesStream() : Observable<any> {

    }

}