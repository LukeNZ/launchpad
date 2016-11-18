import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";
import {AbstractService} from "../Services/AbstractService";
import {Update} from "../Interfaces/Update";
import {Launch} from "../Classes/Launch";

@Injectable()
export class InitializationService extends AbstractService {

    constructor(public http: Http) {
        super();
    }

    /**
     * Fetches the status of the application.
     *
     * @returns {Observable<R>}
     */
    public getStatus() : Observable<any> {
        return this.http.get('/api/status', this.headers())
            .map(this.extractData);
    }

    /**
     * Fetches all current launch updates from the server.
     *
     * @returns {Observable<Update[]>}
     */
    public getUpdates() : Observable<Update[]> {
        return this.http.get('/api/updates', this.headers())
            .map(this.extractData);
    }

    /**
     * Fetches the current launch status from the server. This includes all webcasts, descriptions,
     * resources, and current state of the launch.
     *
     * @returns {Observable<Launch>}
     */
    public getLaunch() : Observable<Launch> {
        return this.http.get('/api/launch', this.headers())
            .map(this.extractData)
            .map(data => {
                return Launch.create(data);
            });
    }
}