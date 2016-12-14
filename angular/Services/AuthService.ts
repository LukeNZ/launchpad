import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {AbstractService} from "angular-toolshed/angular-toolshed";
import {LoginModel} from "../Interfaces/LoginModel";

@Injectable()
/**
 * Authentication service, allowing a user to login and logout. Also allows the application to retrieve
 * whether a user is logged in, and fetch their auth token.
 * @class
 */
export class AuthService extends AbstractService {

    private _isLoggedIn: boolean = false;

    /**
     * Construct the service
     *
     * @param http
     */
    constructor(private http: Http) {
        super();
        this._isLoggedIn = !!localStorage.getItem('auth:token');
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
     * Returns the token this user is authenticated with.
     *
     * @returns {string} The auth token.
     */
    get authtoken() : string {
        return localStorage.getItem('auth:token');
    }

    /**
     * Returns the array of permissions this user is authenticated with.
     *
     * @returns {string[]} Permissions.
     */
    get permissions() : string[] {
        return JSON.parse(localStorage.getItem('auth:permissions'));
    }

    /**
     * Does the logged in user have a moderator permission?
     *
     * @returns {boolean}
     */
    get hasModeratorPermission() : boolean {
        return this.permissions.indexOf('moderator') != -1;
    }

    /**
     * Does the logged in user have a privileges permission?
     *
     * @returns {boolean}
     */
    get hasPrivilegesPermission() : boolean {
        return this.permissions.indexOf('privileges') != -1;
    }

    /**
     * Attempts to log the claimed identity of a user in. If successful, sets a token in the client,
     * if not; allows another attempt.
     *
     * @param model {LoginModel} The username and password the user is attempting to login with.
     *
     * @returns {Observable<boolean>}
     */
    public login(model: LoginModel) : Observable<boolean> {
        return this.http.post('/api/auth/login', { username: model.username, password: model.password }, this.headers())
            .map(response => {
                this._isLoggedIn = true;

                // Set the authorization properties
                let authorizationHeader = response.headers.get('Authorization');
                let authToken = authorizationHeader.split(" ").pop();
                localStorage.setItem('auth:token', authToken);

                // Set the permissions properties
                let permissionsHeader = response.headers.get('Permissions');
                let permissions = permissionsHeader.split(" ");
                localStorage.setItem('auth:permissions', JSON.stringify(permissions));

                return true;
            })
            .catch(this.handleError);
    }

    /**
     * Log the user out of the application. Remove their localstorage token, and set the
     * application state isLoggedIn property to false.
     */
    public logout() : void {
        localStorage.removeItem('auth:token');
        localStorage.removeItem('auth:permissions');
        this._isLoggedIn = false;
    }
}