import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";
import {AbstractService} from "../Services/AbstractService";
import {Status} from "../Interfaces/Status";
import {Launch} from "../Classes/Launch";

@Injectable()
/**
 * Service which allows the fetching of application initialization data from the server over AJAX.
 * This includes the current application state, the statuses posted so far, and the current launch
 * details.
 * @class
 */
export class InitializationService extends AbstractService {

    constructor(public http: Http) {
        super();
    }

    /**
     * Fetches the status of the T Minus Ten application.
     *
     * @returns {Observable<any>}
     */
    public getTMinusTen() : Observable<any> {
        return this.http.get('/api/tminusten', this.headers())
            .map(this.extractData);
    }

    /**
     * Fetches all current launch statuses from the server.
     *
     * @returns {Observable<Status[]>}
     */
    public getStatuses() : Observable<Status[]> {
        return this.http.get('/api/statuses', this.headers())
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