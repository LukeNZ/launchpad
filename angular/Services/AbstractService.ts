import {Response, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";

/**
 * Abstract service that provides helper methods for other services.
 * @class
 */
export abstract class AbstractService {

    /**
     * Handle an error.
     *
     * @param error
     */
    public handleError(error: Response|any) :  any {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    /**
     * Creates a default headers object for use on each request that ensures any server marks it as an AJAX request.
     *
     * May need to comment Content-Type header entry until this is fixed: https://github.com/angular/angular/commit/7cd4741fcbbea6d58281b3055d1ae7691de1662b
     *
     * @returns {RequestOptions}
     */
    public headers() : RequestOptions {
        let headers = new Headers();
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Content-Type', 'application/json');

        let authToken = localStorage.getItem('authtoken');

        if (authToken != null) {
            headers.append('Authorization', `bearer ${authToken}`);
        }

        return new RequestOptions({ headers: headers});
    }

    /**
     * Extract JSON data from a response object.
     *
     * @param res
     * @returns
     */
    public extractData(res: Response) : any {
        let body;

        if (res.text()) {
            body = res.json();
        }

        return body || {};
    }
}