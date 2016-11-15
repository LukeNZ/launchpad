import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {AbstractService} from "./AbstractService";
import {LoginModel} from "../Interfaces/LoginModel";

@Injectable()
export class AuthService extends AbstractService {

    private _isLoggedIn: boolean = false;

    /**
     * Construct the service
     *
     * @param http
     */
    constructor(private http: Http) {
        super();
        this._isLoggedIn = !!localStorage.getItem('authtoken');
    }

    /**
     * Retrieves whether the user is logged in or not.
     *
     * @returns {boolean}   Is the user logged in or not?
     */
    get isLoggedIn() : boolean {
        return this._isLoggedIn;
    }

    /**
     * Attempts to log the claimed identity of a user in. If successful, sets a token in the client,
     * if not; allows another attempt.
     *
     * @param model  The username and password the user is attempting to login with.
     *
     * @returns {Observable<boolean>}
     */
    public login(model: LoginModel) : Observable<boolean> {
        return this.http.post('/api/auth/login', { username: model.username, password: model.password }, this.headers())
            .map(response => {
                this._isLoggedIn = true;
                let authorizationHeader = response.headers.get('Authorization');
                let authToken = authorizationHeader.split(" ").pop();
                localStorage.setItem('authtoken', authToken); // TODO: Figure out why PHPStorm does not like model.authtoken ("unresolved variable")
                return true;
            })
            .catch(this.handleError);
    }

    /**
     * Log the user out of the application. Remove their localstorage token, and set the
     * application state isLoggedIn property to false.
     */
    public logout() : void {
        localStorage.removeItem('authtoken');
        this._isLoggedIn = false;
    }
}