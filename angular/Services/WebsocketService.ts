import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {AuthService} from "./AuthService";
var io = require('socket.io-client');
var uuid = require('node-uuid');

@Injectable()
export class WebsocketService {
    public socketClient = null;

    /**
     * Construct an instance of the websocket service. Automatically connect to the websocket
     * server, and emit a join message. Depending on whether the user is authed or not, include
     * the authentication token with the message.
     *
     * @param authService
     */
    constructor(private authService: AuthService) {
        this.socketClient = io.connect("localhost:3001");

        if (authService.isLoggedIn) {
            this.socketClient.emit('msg:join', { token: authService.authtoken });
        } else {
            this.socketClient.emit('msg:join', {});
        }
    }

    /**
     *
     * @param typingStatus
     */
    public emitTypingStatus(typingStatus : boolean) : void {
        this.socketClient.emit("typingStatus", typingStatus);
    }

    /**
     *
     * @param launchUpdate
     */
    public emitCreateLaunchUpdate(launchUpdate : string) : void {
        this.socketClient.emit("launchUpdate", launchUpdate);
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
        this.socketClient.emit("launchStatus", launchStatus);
    }

    /**
     * Emit a app status to the server. This includes statuses such as `enableApp`, `disableApp`,
     * `editWebcastData`, and `editLaunchData`.
     *
     * @param statusType    One of  `enableApp`, `disableApp`,`editWebcastData`, and `editLaunchData`.
     * @param data          Data to be sent up to the serveras payload.
     */
    public emitAppStatus(statusType: string, data? : any) : Observable<any> {

        let msgId = uuid.v4();
        if (!data) { data = {}; }

        this.socketClient.emit("msg:appStatus", {
            token: this.authService.authtoken,
            uuid: msgId,
            statusType: statusType,
            data: data
        });

        return new Observable(observer => {
            this.socketClient.on('response:appStatus', data => {
                if (data.uuid == msgId) {
                    return observer.next(data);
                }
            });
            return () => this.socketClient.disconnect();
        });
    }

    /**
     *
     * @returns {Observable}
     */
    public launchUpdatesStream() : Observable<any> {
        return new Observable(observer => {
            this.socketClient.on('launchUpdate', data => observer.next(data));
            return () => this.socketClient.disconnect();
        });
    }

    /**
     *
     * @returns {Observable}
     */
    public launchStatusesStream() : Observable<any> {
        return new Observable(observer => {

            this.socketClient.on('launchStatus', data => observer.next(data));
            return () => this.socketClient.disconnect();
        });
    }

    /**
     *
     */
    //public appStatusesStream() : Observable<any> {

    //}
}