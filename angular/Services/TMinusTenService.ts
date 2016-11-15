import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";
import {AbstractService} from "../Services/AbstractService";

@Injectable()
export class TMinusTenService extends AbstractService {

    constructor(public http: Http) {
        super();
    }

    /**
     *
     */
    public getUpdates() : Observable<any> {
        return this.http.get('/api/updates', this.headers()).map(res => this.extractData(res));
    }

    /**
     *
     */
    public getStatus() : Observable<any> {
        return this.http.get('/api/status', this.headers());
    }

    /**
     *
     * @returns {Observable<Response>}
     */
    public getWebcasts() : Observable<any> {
        return this.http.get('/api/webcasts', this.headers());
    }
}