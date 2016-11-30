import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {AuthService} from "./AuthService";
import {Status} from "../Interfaces/Status";
import {WebsocketResponse} from "../Interfaces/WebsocketResponse";
var io = require('socket.io-client');

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
     * Sends a typing status notification up to the server.
     *
     * @param typingStatus
     */
    public emitTypingStatus(typingStatus : boolean) : void {

        this.socketClient.emit("msg:typingStatus", {
            token: this.authService.authtoken,
            isTyping: typingStatus
        });
    }

    /**
     * An observable stream of typing status messages received from the server.
     *
     * @returns {Observable<any>}
     */
    public typingStatusesStream() : Observable<any> {
        return new Observable(observer => {
            this.socketClient.on('msg:typingStatus', data => observer.next(data));
            return () => this.socketClient.disconnect();
        });
    }

    /**
     * Sends a launch status creation notification up to the server.
     *
     * @param launchStatus {string} A string to create a new launch status from.
     * @param statusType {string} The type of status being sent up.
     * @param eventType {string?} Optional parameter indicating the type of event being created if
     * the launchStatus is of type "update"
     */
    public emitLaunchStatusCreate(launchStatus : string, statusType: string, eventType?: string) : void {

        let data = <any>{
            token: this.authService.authtoken,
            statusType: statusType,
            text: launchStatus
        };

        if (eventType != null) {
            data.eventType = eventType;
        }

        this.socketClient.emit("msg:launchStatusCreate", data);
    }

    /**
     * An observable stream of launch status messages received from the server.
     *
     * @returns {Observable<Status>}
     */
    public launchStatusesStream() : Observable<Status> {
        return new Observable(observer => {
            this.socketClient.on('msg:launchStatusCreate', data => observer.next(data));
            return () => this.socketClient.disconnect();
        });
    }

    /**
     * An observable stream of launch status responses received from the server. Used
     * to confirm that a launch status emitted to the server was acknowledged.
     *
     * @returns {Observable<WebsocketResponse>}
     */
    public launchStatusResponsesStream() : Observable<WebsocketResponse> {
        return new Observable(observer => {
            this.socketClient.on('response:launchStatusCreate', data => observer.next(data));
            return () => this.socketClient.disconnect();
        });
    }

    /**
     * Emits a request, or a cancellation of a request, to edit a launch status to the server.
     *
     * @param launchStatus {Status} The status an edit request has been made for.
     * @param isRequesting {boolean} true if the client is requesting edit rights, false if the
     * client is cancelling their already granted edit rights.
     */
    public emitLaunchStatusEditRequest(launchStatus: Status, isRequesting: boolean) : void {
        this.socketClient.emit("msg:launchStatusCreate", {
            token: this.authService.authtoken,
            statusId: launchStatus.statusId,
            isRequesting: isRequesting
        });
    }

    /**
     * An observable stream of launch status edit requests and cancellations received
     * from the server.
     *
     * @returns {Observable<any>}
     */
    public launchStatusEditRequestsStream() : Observable<any> {
        return new Observable(observer => {
            this.socketClient.on('msg:launchStatusEditRequest', data => observer.next(data));
            return () => this.socketClient.disconnect();
        });
    }

    /**
     * Emits a request to the server when a launch status is edited.
     *
     * @param launchStatus {Status} The launch status being edited.
     * @param replacementText {string} The replacement text to edit into the launch status.
     */
    public emitLaunchStatusEdit(launchStatus: Status, replacementText: string) : void {
        this.socketClient.emit("msg:launchStatusEdit", {
            token: this.authService.authtoken,
            statusId: launchStatus.statusId,
            text: replacementText
        });
    }

    /**
     * An observable stream of launch status edits received from the server.
     *
     * @returns {Observable<any>}
     */
    public launchStatusEditsStream() : Observable<any> {
        return new Observable(observer => {
            this.socketClient.on('msg:launchStatusEdit', data => observer.next(data));
            return () => this.socketClient.disconnect();
        });
    }

    /**
     * An observable stream of launch status edit responses received from the server. Used
     * to confirm that a launch status edit emitted to the server was acknowledged.
     *
     * @returns {Observable<WebsocketResponse>}
     */
    public launchStatusEditResponsesStream() : Observable<WebsocketResponse> {
        return new Observable(observer => {
            this.socketClient.on('response:launchStatusEdit', data => observer.next(data));
            return () => this.socketClient.disconnect();
        });
    }


    /**
     * Emits a request to the server when a launch status is deleted.
     *
     * @param launchStatus {Status} The launch status being deleted.
     */
    public emitLaunchStatusDelete(launchStatus: Status) : void {
        this.socketClient.emit("msg:launchStatusDelete", {
            token: this.authService.authtoken,
            statusId: launchStatus.statusId
        });
    }

    /**
     * An observable stream of launch status deletions received from the server.
     *
     * @returns {Observable<any>}
     */
    public launchStatusDeletionsStream() : Observable<any> {
        return new Observable(observer => {
            this.socketClient.on('msg:launchStatusDelete', data => observer.next(data));
            return () => this.socketClient.disconnect();
        });
    }

    /**
     * An observable stream of launch status deletion responses received from the server. Used
     * to confirm that a launch status deletion emitted to the server was acknowledged.
     *
     * @returns {Observable<WebsocketResponse>}
     */
    public launchStatusDeletionsResponsesStream() : Observable<WebsocketResponse> {
        return new Observable(observer => {
            this.socketClient.on('response:launchStatusDelete', data => observer.next(data));
            return () => this.socketClient.disconnect();
        });
    }

    /**
     * Emit a app status to the server. This includes types such as `enableApp`, `disableApp`,
     * `editLaunch`, and `editEvent`.
     *
     * @param type {string} One of `enableApp`, `disableApp`, `editLaunch`, and `editEvent`.
     * @param data {*} Data to be sent up to the server as payload.
     */
    public emitAppStatus(type: string, data? : any) : void {

        if (!data) { data = {}; }

        this.socketClient.emit("msg:appStatus", {
            token: this.authService.authtoken,
            type: type,
            data: data
        });
    }

    /**
     * An observable stream of app statuses indicating changes to the state and functionality
     * of the application.
     *
     * @returns {Observable<any>}
     */
    public appStatusesStream() : Observable<any> {
        return new Observable(observer => {
            this.socketClient.on('msg:appStatus', data => observer.next(data));
            return () => this.socketClient.disconnect();
        });
    }

    /**
     * An observably stream of app status responses used to confirm when an appStatus message
     * sent by the client is acknowledged by the server.
     *
     * @returns {Observable<WebsocketResponse>}
     */
    public appStatusResponsesStream() : Observable<WebsocketResponse> {
        return new Observable(observer => {
            this.socketClient.on('response:appStatus', data => observer.next(data));
            return () => this.socketClient.disconnect();
        });
    }
}