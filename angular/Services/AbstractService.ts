import {Response, Headers, RequestOptions} from "@angular/http";

export abstract class AbstractService {
    /**
     * Handle an error.
     *
     * @param error
     */
    public handleError(error: Response|any) :  any {

    }

    /**
     * Creates a default headers object for use on each request that ensures any server marks it as an AJAX request.
     *
     * TODO: Uncomment Content-Type header entry after this is fixed: https://github.com/angular/angular/commit/7cd4741fcbbea6d58281b3055d1ae7691de1662b
     *
     * @returns {RequestOptions}
     */
    public headers() : RequestOptions {
        let headers = new Headers();
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Content-Type', 'application/json');
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