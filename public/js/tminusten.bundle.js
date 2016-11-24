webpackJsonp([0],{

/***/ 382:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var platform_browser_1 = __webpack_require__(34);
var AuthService_1 = __webpack_require__(40);
var LaunchDataService_1 = __webpack_require__(49);
var AppDataService_1 = __webpack_require__(71);
var InitializationService_1 = __webpack_require__(385);
var Observable_1 = __webpack_require__(4);
__webpack_require__(296);
var HomeComponent = (function () {
    function HomeComponent(authData, launchData, appData, initializationService, titleService) {
        var _this = this;
        this.authData = authData;
        this.launchData = launchData;
        this.appData = appData;
        this.initializationService = initializationService;
        this.titleService = titleService;
        Observable_1.Observable.forkJoin(this.initializationService.getLaunch(), this.initializationService.getStatuses(), this.initializationService.getTMinusTen()).subscribe(function (data) {
            _this.launchData.setLaunch(data[0]);
            _this.launchData.setStatuses(data[1]);
            _this.appData.isActive = data[2].isActive;
            if (!_this.appData.isActive) {
                _this.appData.isSettingsVisible = true;
            }
            _this.appData.isLoading = false;
        });
        this.titleService.setTitle("T Minus Ten");
    }
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'tmt-home',
            template: "\n        <p *ngIf=\"appData.isLoading\">Loading...</p>\n        \n        <!-- Only show the below contents if the application has loaded. -->\n        <ng-container *ngIf=\"!appData.isLoading\">\n        \n            <!-- Allow a logged in user to access the application settings to start a launch,\n             allow a logged in user to edit the launch, allow a general user to set their personal \n             preferences. -->\n            <tmt-settings \n            *ngIf=\"(authData.isLoggedIn && !appData.isActive) || appData.isActive\" \n            [hidden]=\"!appData.isSettingsVisible\"></tmt-settings>\n                \n        \n            <!-- Only show if the application is not active. -->\n            <ng-container *ngIf=\"!appData.isActive\">\n            \n                <!-- If the application is not active, and the user is a visitor, \n                show the default message. -->\n                <ng-container *ngIf=\"!authData.isLoggedIn\">\n                    <p>There is no active launch at this time. Check back soon!</p>\n                </ng-container>\n            </ng-container>\n            \n            <!-- Show if the application is active. -->\n            <ng-container *ngIf=\"appData.isActive\">\n                <tmt-header></tmt-header>\n                <tmt-livestream></tmt-livestream>\n                <tmt-statusbar></tmt-statusbar>\n                <tmt-updates></tmt-updates>\n            </ng-container>  \n             \n        </ng-container>     \n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof AuthService_1.AuthService !== 'undefined' && AuthService_1.AuthService) === 'function' && _a) || Object, (typeof (_b = typeof LaunchDataService_1.LaunchDataService !== 'undefined' && LaunchDataService_1.LaunchDataService) === 'function' && _b) || Object, (typeof (_c = typeof AppDataService_1.AppDataService !== 'undefined' && AppDataService_1.AppDataService) === 'function' && _c) || Object, (typeof (_d = typeof InitializationService_1.InitializationService !== 'undefined' && InitializationService_1.InitializationService) === 'function' && _d) || Object, (typeof (_e = typeof platform_browser_1.Title !== 'undefined' && platform_browser_1.Title) === 'function' && _e) || Object])
    ], HomeComponent);
    return HomeComponent;
    var _a, _b, _c, _d, _e;
}());
exports.HomeComponent = HomeComponent;


/***/ },

/***/ 383:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var AuthService_1 = __webpack_require__(40);
var router_1 = __webpack_require__(112);
var platform_browser_1 = __webpack_require__(34);
var LoginComponent = (function () {
    function LoginComponent(authService, router, titleService) {
        this.authService = authService;
        this.router = router;
        this.titleService = titleService;
        this.submitting = false;
        this.loginModel = {
            username: "",
            password: ""
        };
        this.titleService.setTitle("Login | T Minus Ten");
    }
    /**
     * Called when the login form is submitted.
     *
     * When the login form is submitted, a request is made to login to T Minus Ten, passing in the
     * login model properties. If the request was successful, the router navigates back to the index page.
     * If the request was not successful, display a message in the notification banner that your login was
     * not successful.
     */
    LoginComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitting = true;
        this.authService.login(this.loginModel).subscribe(function (success) {
            _this.router.navigate(["/"]);
        }, function (error) {
            _this.submitting = false;
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'tmt-login',
            template: "\n        <form (ngSubmit)=\"onSubmit()\" #loginForm=\"ngForm\">\n            <label for=\"username\">Username</label>\n            <input type=\"text\" [(ngModel)]=\"loginModel.username\" name=\"username\" id=\"username\" placeholder=\"Username\" required /><br/>\n            \n            <label for=\"password\">Password</label>\n            <input type=\"text\" [(ngModel)]=\"loginModel.password\" name=\"password\" id=\"password\" placeholder=\"Password\" required /><br/>\n            \n            <button type=\"submit\" [hidden]=\"!loginForm.form.valid\" [disabled]=\"submitting\">{{ submitting ? \"Logging in...\" : \"Login\" }}</button>\n        </form>\n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof AuthService_1.AuthService !== 'undefined' && AuthService_1.AuthService) === 'function' && _a) || Object, (typeof (_b = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _b) || Object, (typeof (_c = typeof platform_browser_1.Title !== 'undefined' && platform_browser_1.Title) === 'function' && _c) || Object])
    ], LoginComponent);
    return LoginComponent;
    var _a, _b, _c;
}());
exports.LoginComponent = LoginComponent;


/***/ },

/***/ 384:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var http_1 = __webpack_require__(54);
var Observable_1 = __webpack_require__(4);
/**
 * Abstract service that provides helper methods for other services.
 * @class
 */
var AbstractService = (function () {
    function AbstractService() {
    }
    /**
     * Handle an error.
     *
     * @param error
     */
    AbstractService.prototype.handleError = function (error) {
        var errMsg;
        if (error instanceof http_1.Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable_1.Observable.throw(errMsg);
    };
    /**
     * Creates a default headers object for use on each request that ensures any server marks it as an AJAX request.
     *
     * May need to comment Content-Type header entry until this is fixed: https://github.com/angular/angular/commit/7cd4741fcbbea6d58281b3055d1ae7691de1662b
     *
     * @returns {RequestOptions}
     */
    AbstractService.prototype.headers = function () {
        var headers = new http_1.Headers();
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Content-Type', 'application/json');
        var authToken = localStorage.getItem('authtoken');
        if (authToken != null) {
            headers.append('Authorization', "bearer " + authToken);
        }
        return new http_1.RequestOptions({ headers: headers });
    };
    /**
     * Extract JSON data from a response object.
     *
     * @param res
     * @returns
     */
    AbstractService.prototype.extractData = function (res) {
        var body;
        if (res.text()) {
            body = res.json();
        }
        return body || {};
    };
    return AbstractService;
}());
exports.AbstractService = AbstractService;


/***/ },

/***/ 385:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var http_1 = __webpack_require__(54);
var AbstractService_1 = __webpack_require__(384);
var Launch_1 = __webpack_require__(520);
var InitializationService = (function (_super) {
    __extends(InitializationService, _super);
    function InitializationService(http) {
        _super.call(this);
        this.http = http;
    }
    /**
     * Fetches the status of the T Minus Ten application.
     *
     * @returns {Observable<any>}
     */
    InitializationService.prototype.getTMinusTen = function () {
        return this.http.get('/api/tminusten', this.headers())
            .map(this.extractData);
    };
    /**
     * Fetches all current launch statuses from the server.
     *
     * @returns {Observable<Status[]>}
     */
    InitializationService.prototype.getStatuses = function () {
        return this.http.get('/api/statuses', this.headers())
            .map(this.extractData);
    };
    /**
     * Fetches the current launch status from the server. This includes all webcasts, descriptions,
     * resources, and current state of the launch.
     *
     * @returns {Observable<Launch>}
     */
    InitializationService.prototype.getLaunch = function () {
        return this.http.get('/api/launch', this.headers())
            .map(this.extractData)
            .map(function (data) {
            return Launch_1.Launch.create(data);
        });
    };
    InitializationService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], InitializationService);
    return InitializationService;
    var _a;
}(AbstractService_1.AbstractService));
exports.InitializationService = InitializationService;


/***/ },

/***/ 40:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var http_1 = __webpack_require__(54);
var AbstractService_1 = __webpack_require__(384);
var AuthService = (function (_super) {
    __extends(AuthService, _super);
    /**
     * Construct the service
     *
     * @param http
     */
    function AuthService(http) {
        _super.call(this);
        this.http = http;
        this._isLoggedIn = false;
        this._isLoggedIn = !!localStorage.getItem('auth:token');
    }
    Object.defineProperty(AuthService.prototype, "isLoggedIn", {
        /**
         * Retrieves whether the user is logged in or not.
         *
         * @returns {boolean}   Is the user logged in or not?
         */
        get: function () {
            return this._isLoggedIn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "authtoken", {
        /**
         * Returns the token this user is authenticated with.
         *
         * @returns {string}    The auth token.
         */
        get: function () {
            return localStorage.getItem('auth:token');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Attempts to log the claimed identity of a user in. If successful, sets a token in the client,
     * if not; allows another attempt.
     *
     * @param model  The username and password the user is attempting to login with.
     *
     * @returns {Observable<boolean>}
     */
    AuthService.prototype.login = function (model) {
        var _this = this;
        return this.http.post('/api/auth/login', { username: model.username, password: model.password }, this.headers())
            .map(function (response) {
            _this._isLoggedIn = true;
            var authorizationHeader = response.headers.get('Authorization');
            var authToken = authorizationHeader.split(" ").pop();
            localStorage.setItem('auth:token', authToken); // TODO: Figure out why PHPStorm does not like model.authtoken ("unresolved variable")
            return true;
        })
            .catch(this.handleError);
    };
    /**
     * Log the user out of the application. Remove their localstorage token, and set the
     * application state isLoggedIn property to false.
     */
    AuthService.prototype.logout = function () {
        localStorage.removeItem('auth:token');
        this._isLoggedIn = false;
    };
    AuthService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], AuthService);
    return AuthService;
    var _a;
}(AbstractService_1.AbstractService));
exports.AuthService = AuthService;


/***/ },

/***/ 409:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// Modules
var core_1 = __webpack_require__(0);
var platform_browser_1 = __webpack_require__(34);
var http_1 = __webpack_require__(54);
var forms_1 = __webpack_require__(295);
var app_routes_1 = __webpack_require__(530);
// Components
var TMinusTen_component_1 = __webpack_require__(528);
var Home_component_1 = __webpack_require__(382);
var Header_component_1 = __webpack_require__(523);
var Countdown_component_1 = __webpack_require__(521);
var StatusBar_component_1 = __webpack_require__(527);
var Updates_component_1 = __webpack_require__(529);
var Livestream_component_1 = __webpack_require__(524);
var Login_component_1 = __webpack_require__(383);
var NotificationBanner_component_1 = __webpack_require__(525);
var Settings_component_1 = __webpack_require__(526);
var DateTimeEntry_component_1 = __webpack_require__(522);
// Services
var InitializationService_1 = __webpack_require__(385);
var WebsocketService_1 = __webpack_require__(73);
var AuthService_1 = __webpack_require__(40);
var LaunchDataService_1 = __webpack_require__(49);
var NotificationBannerService_1 = __webpack_require__(72);
var AppDataService_1 = __webpack_require__(71);
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            // Modules
            imports: [platform_browser_1.BrowserModule, http_1.HttpModule, forms_1.FormsModule, app_routes_1.routing],
            // Services
            providers: [InitializationService_1.InitializationService, WebsocketService_1.WebsocketService, AuthService_1.AuthService, LaunchDataService_1.LaunchDataService, AppDataService_1.AppDataService, NotificationBannerService_1.NotificationBannerService],
            // Components
            declarations: [TMinusTen_component_1.TMinusTenComponent, Home_component_1.HomeComponent, Login_component_1.LoginComponent, Header_component_1.HeaderComponent, Countdown_component_1.CountdownComponent, StatusBar_component_1.StatusBarComponent, Updates_component_1.UpdatesComponent, Livestream_component_1.LivestreamComponent, NotificationBanner_component_1.NotificationBannerComponent, Settings_component_1.SettingsComponent, DateTimeEntry_component_1.DateTimeEntryComponent],
            // Starting components
            bootstrap: [TMinusTen_component_1.TMinusTenComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;


/***/ },

/***/ 49:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var BehaviorSubject_1 = __webpack_require__(110);
var WebsocketService_1 = __webpack_require__(73);
var LaunchDataService = (function () {
    /**
     *
     * @param websocketService
     */
    function LaunchDataService(websocketService) {
        var _this = this;
        this.websocketService = websocketService;
        this._launchSubject = new BehaviorSubject_1.BehaviorSubject(this._launch);
        this._launchObservable = this._launchSubject.asObservable();
        // Launch statuses and updates
        this._statuses = [];
        this.websocketService.launchStatusesStream().subscribe(function (websocket) {
            _this.addStatus(websocket);
        });
        this.websocketService.launchStatusResponsesStream().subscribe(function (websocket) {
            _this.addStatus(websocket.response);
        });
    }
    /**
     * Sets the launch model of the service, and also sets the subject
     * for any subscribers listening for updates.
     *
     * @param launch    The new launch value.
     */
    LaunchDataService.prototype.setLaunch = function (launch) {
        this._launch = launch;
        this._launchSubject.next(launch);
    };
    Object.defineProperty(LaunchDataService.prototype, "launch", {
        /**
         * Plain accessor for the launch model.
         *
         * @returns {Launch} The launch model.
         */
        get: function () {
            return this._launch;
        },
        /**
         * Setter for the launch model.
         *
         * @param launch {Launch} The launch model to be set.
         */
        set: function (launch) {
            this._launch = launch;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns an observable for the launch model
     *
     * @returns {Observable<Launch>} An observable of the launch model.
     */
    LaunchDataService.prototype.launchObservable = function () {
        return this._launchObservable;
    };
    /**
     * Sets the array of statuses.
     *
     * @param statuses
     */
    LaunchDataService.prototype.setStatuses = function (statuses) {
        this._statuses = statuses;
    };
    /**
     * Pushes an status to the end of the statuses array.
     *
     * @param status {Status} The status to append to the end of the array.
     */
    LaunchDataService.prototype.addStatus = function (status) {
        this._statuses.push(status);
    };
    /**
     * Deletes an status from the updates array.
     *
     * @param status {Status}
     *
     * @returns {boolean} True if the status was deleted, false if the status was not deleted.
     */
    LaunchDataService.prototype.deleteStatus = function (status) {
        var index = this._statuses.indexOf(status);
        if (index > -1) {
            this.setStatuses(this._statuses.splice(index, 1));
            return true;
        }
        return false;
    };
    Object.defineProperty(LaunchDataService.prototype, "statuses", {
        /**
         * Accessor for updates.
         *
         * @returns {Status[]}
         */
        get: function () {
            return this._statuses;
        },
        enumerable: true,
        configurable: true
    });
    LaunchDataService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof WebsocketService_1.WebsocketService !== 'undefined' && WebsocketService_1.WebsocketService) === 'function' && _a) || Object])
    ], LaunchDataService);
    return LaunchDataService;
    var _a;
}());
exports.LaunchDataService = LaunchDataService;


/***/ },

/***/ 520:
/***/ function(module, exports) {

"use strict";
"use strict";
var Launch = (function () {
    /**
     *
     *
     * @param name
     * @param beganAt
     * @param countdown
     * @param isPaused
     * @param introduction
     * @param webcasts
     * @param resources
     * @param descriptionSections
     */
    function Launch(name, beganAt, countdown, isPaused, introduction, webcasts, resources, descriptionSections) {
        this.webcasts = [];
        this.resources = [];
        this.descriptionSections = [];
        this.name = name;
        this.beganAt = typeof beganAt === 'string' ? new Date(beganAt) : beganAt;
        this.countdown = typeof countdown === 'string' ? new Date(countdown) : countdown;
        this.isPaused = isPaused;
        this.introduction = introduction;
        this.webcasts = webcasts;
        this.resources = resources;
        this.descriptionSections = descriptionSections;
    }
    /**
     * Static helper to construct a Launch object.
     *
     * @param model
     * @returns {Launch}
     */
    Launch.create = function (model) {
        return new Launch(model.name, model.beganAt, model.countdown, model.isPaused, model.introduction, model.webcasts, model.resources, model.descriptionSections);
    };
    return Launch;
}());
exports.Launch = Launch;


/***/ },

/***/ 521:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var LaunchDataService_1 = __webpack_require__(49);
var moment = __webpack_require__(1);
var CountdownComponent = (function () {
    function CountdownComponent(launchData) {
        this.launchData = launchData;
    }
    /**
     * Runs the countdown processor.
     */
    CountdownComponent.prototype.ngOnInit = function () {
        setInterval(this.countdownProcessor.bind(this), 1000);
    };
    /**
     * Process the countdown, calculating the components of the countdown based on how many seconds currently
     * remain before the launch time is reached.
     */
    CountdownComponent.prototype.countdownProcessor = function () {
        if (!this.launchData.launch.isPaused) {
            var relativeSecondsBetween = ((+(moment().milliseconds(0).toDate()) - +this.launchData.launch.countdown) / 1000);
            var secondsBetween = Math.abs(relativeSecondsBetween);
            this.sign = relativeSecondsBetween <= 0 ? '-' : '+';
            this.days = Math.floor(secondsBetween / (60 * 60 * 24));
            secondsBetween -= this.days * 60 * 60 * 24;
            this.hours = Math.floor(secondsBetween / (60 * 60));
            secondsBetween -= this.hours * 60 * 60;
            this.minutes = Math.floor(secondsBetween / 60);
            secondsBetween -= this.minutes * 60;
            this.seconds = secondsBetween;
            if (typeof this.callback === "function") {
                this.callback(relativeSecondsBetween);
            }
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], CountdownComponent.prototype, "callback", void 0);
    CountdownComponent = __decorate([
        core_1.Component({
            selector: 'tmt-countdown',
            template: "\n        <table class=\"countdown\">\n            <tr *ngIf=\"!launchData.launch.isPaused\">\n                <td>T{{ sign }}</td>\n                <td>{{ days }}<small>d</small></td>\n                <td>{{ hours }}<small>h</small></td>\n                <td>{{ minutes }}<small>m</small></td>\n                <td>{{ seconds }}<small>s</small></td>\n            </tr>\n            <tr *ngIf=\"launchData.launch.isPaused\">\n                <td>Paused</td>\n            </tr>\n        </table>\n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof LaunchDataService_1.LaunchDataService !== 'undefined' && LaunchDataService_1.LaunchDataService) === 'function' && _a) || Object])
    ], CountdownComponent);
    return CountdownComponent;
    var _a;
}());
exports.CountdownComponent = CountdownComponent;


/***/ },

/***/ 522:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var moment = __webpack_require__(1);
var DateTimeEntryComponent = (function () {
    function DateTimeEntryComponent() {
        this.dateChange = new core_1.EventEmitter();
        this.months = ["January", "February", "March", "April", "May", "June", "July", "August",
            "September", "October", "November", "December"];
    }
    /**
     * On component initialization, check if the date being passed into the component is undefined.
     * If it is, set the internal component date to now.
     */
    DateTimeEntryComponent.prototype.ngOnInit = function () {
        this.tempDate = this.date == null ? moment().milliseconds(0).toDate() : this.date;
    };
    /**
     * Returns a human readable month string from the current month component of the internal
     * component date.
     *
     * @returns {string} Human readable date string.
     */
    DateTimeEntryComponent.prototype.humanReadableMonth = function () {
        return this.months[this.tempDate.getUTCMonth()];
    };
    /**
     * Increments the provided date time component, one of "seconds", "minutes", "hours", "days", "months",
     * or "years" by one.
     *
     * @param dateTimeComponent {string} The component to increment.
     */
    DateTimeEntryComponent.prototype.increment = function (dateTimeComponent) {
        this.incrementOrDecrement('+', dateTimeComponent);
    };
    /**
     * Decrements the provided date time component, one of "seconds", "minutes", "hours", "days", "months",
     * or "years" by one.
     *
     * @param dateTimeComponent {string} The component to decrement.
     */
    DateTimeEntryComponent.prototype.decrement = function (dateTimeComponent) {
        this.incrementOrDecrement('-', dateTimeComponent);
    };
    /**
     * Internal mechanism for incrementing or decrementing a component of a date object. Once the
     * change has occurred, emits an update to the `dateChange` output EventEmitter.
     *
     * @param sign {string} Either '+' or '-', to increment or decrement respectively.
     * @param dateTimeComponent {string} The component to increment or decrement.
     */
    DateTimeEntryComponent.prototype.incrementOrDecrement = function (sign, dateTimeComponent) {
        var direction = sign === "+" ? 1 : -1;
        switch (dateTimeComponent) {
            case 'years':
                this.tempDate.setUTCFullYear(this.tempDate.getUTCFullYear() + direction);
                break;
            case 'months':
                this.tempDate.setUTCMonth(this.tempDate.getUTCMonth() + direction);
                break;
            case 'days':
                this.tempDate.setUTCDate(this.tempDate.getUTCDate() + direction);
                break;
            case 'hours':
                this.tempDate.setUTCHours(this.tempDate.getUTCHours() + direction);
                break;
            case 'minutes':
                this.tempDate.setMinutes(this.tempDate.getMinutes() + direction);
                break;
            case 'seconds':
                this.tempDate.setSeconds(this.tempDate.getSeconds() + direction);
                break;
        }
        this.dateChange.emit(this.tempDate);
    };
    /**
     * Sets a component of a date object to the specific new value passed through. Once the
     * change has occurred, emits an update to the `dateChange` output EventEmitter.
     *
     * @param dateTimeComponent {string} The component to adjust values for.
     * @param newValue {*} The new value for the component to hold.
     */
    DateTimeEntryComponent.prototype.setDateTimeComponent = function (dateTimeComponent, newValue) {
        var shouldSet = true;
        var dynamicMethodNames = {
            'years': "setUTCFullYear",
            'months': "setUTCMonth",
            'days': "setUTCDate",
            'hours': "setUTCHours",
            'minutes': "setMinutes",
            'seconds': "setSeconds"
        };
        if (dateTimeComponent === "months") {
            newValue = this.months.indexOf(newValue);
            shouldSet = newValue !== -1;
        }
        if (shouldSet) {
            this.tempDate[dynamicMethodNames[dateTimeComponent]](newValue);
            this.dateChange.emit(this.tempDate);
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DateTimeEntryComponent.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DateTimeEntryComponent.prototype, "date", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_a = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _a) || Object)
    ], DateTimeEntryComponent.prototype, "dateChange", void 0);
    DateTimeEntryComponent = __decorate([
        core_1.Component({
            selector: 'tmt-datetimeentry',
            template: "\n        <div class=\"entryfield hours\">\n            <span (click)=\"increment('hours')\">Up</span>\n            <input id=\"{{ id + 'Hour' }}\" name=\"{{ id + 'Hour' }}\" #hours=\"ngModel\" [ngModel]=\"tempDate.getUTCHours()\" (ngModelChange)=\"setDateTimeComponent('hours', $event)\" type=\"text\" />\n            <span (click)=\"decrement('hours')\">Down</span>\n        </div>\n        \n        <span>:</span>\n        \n        <div class=\"entryfield minutes\"> \n            <span (click)=\"increment('minutes')\">Up</span>\n            <input id=\"{{ id + 'Minute' }}\" name=\"{{ id + 'Minute' }}\" [ngModel]=\"tempDate.getMinutes()\" (ngModelChange)=\"setDateTimeComponent('minutes', $event)\" type=\"text\" />\n            <span (click)=\"decrement('minutes')\">Down</span>\n        </div>\n        \n        <span>:</span>\n        \n        <div class=\"entryfield seconds\"> \n            <span (click)=\"increment('seconds')\">Up</span>\n            <input id=\"{{ id + 'Second' }}\" name=\"{{ id + 'Second' }}\" [ngModel]=\"tempDate.getSeconds()\" (ngModelChange)=\"setDateTimeComponent('seconds', $event)\" type=\"text\" />\n            <span (click)=\"decrement('seconds')\">Down</span>\n        </div>\n        \n        <div class=\"entryfield days\"> \n            <span (click)=\"increment('days')\">Up</span>\n            <input id=\"{{ id + 'Date' }}\" name=\"{{ id + 'Date' }}\" [ngModel]=\"tempDate.getUTCDate()\" (ngModelChange)=\"setDateTimeComponent('days', $event)\" type=\"text\" />\n            <span (click)=\"decrement('days')\">Down</span>\n        </div>\n        \n        <div class=\"entryfield months\"> \n            <span (click)=\"increment('months')\">Up</span>\n            <input id=\"{{ id + 'Month' }}\" name=\"{{ id + 'Month' }}\" [ngModel]=\"humanReadableMonth()\" (ngModelChange)=\"setDateTimeComponent('months', $event)\" type=\"text\" />\n            <span (click)=\"decrement('months')\">Down</span>\n        </div>\n        \n        <div class=\"entryfield years\"> \n            <span (click)=\"increment('years')\">Up</span>\n            <input id=\"{{ id + 'Year' }}\" name=\"{{ id + 'Year' }}\" [ngModel]=\"tempDate.getUTCFullYear()\" (ngModelChange)=\"setDateTimeComponent('years', $event)\" type=\"text\" />\n            <span (click)=\"decrement('years')\">Down</span>\n        </div>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], DateTimeEntryComponent);
    return DateTimeEntryComponent;
    var _a;
}());
exports.DateTimeEntryComponent = DateTimeEntryComponent;


/***/ },

/***/ 523:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var AppDataService_1 = __webpack_require__(71);
var HeaderComponent = (function () {
    function HeaderComponent(appData) {
        this.appData = appData;
    }
    HeaderComponent = __decorate([
        core_1.Component({
            selector: 'tmt-header',
            template: "\n        <div class=\"header-area\">\n            <tmt-countdown></tmt-countdown>\n            <i (click)=\"appData.isSettingsVisible = true\">Settings</i>\n        </div>       \n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof AppDataService_1.AppDataService !== 'undefined' && AppDataService_1.AppDataService) === 'function' && _a) || Object])
    ], HeaderComponent);
    return HeaderComponent;
    var _a;
}());
exports.HeaderComponent = HeaderComponent;


/***/ },

/***/ 524:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var AuthService_1 = __webpack_require__(40);
var LivestreamComponent = (function () {
    function LivestreamComponent(elem, authService) {
        this.elem = elem;
        this.authService = authService;
    }
    LivestreamComponent.prototype.ngOnInit = function () {
        this.calculateElementDimensions();
    };
    LivestreamComponent.prototype.onResize = function (event) {
        this.calculateElementDimensions();
    };
    LivestreamComponent.prototype.calculateElementDimensions = function () {
        var viewportWidth = document.documentElement.clientWidth;
        var viewportHeight = document.documentElement.clientHeight;
        // calculate the height of the livestream component based on the 16:9 ratio for the livestream video
        // and the current viewport width
        var allowanceHeight = this.authService.isLoggedIn ? 400 : 200;
        this.elem.nativeElement.style.height = Math.min(Math.floor(viewportWidth / (16 / 9)), viewportHeight - allowanceHeight) + "px";
    };
    __decorate([
        core_1.HostListener('window:resize', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], LivestreamComponent.prototype, "onResize", null);
    LivestreamComponent = __decorate([
        core_1.Component({
            selector: 'tmt-livestream',
            template: "\n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object, (typeof (_b = typeof AuthService_1.AuthService !== 'undefined' && AuthService_1.AuthService) === 'function' && _b) || Object])
    ], LivestreamComponent);
    return LivestreamComponent;
    var _a, _b;
}());
exports.LivestreamComponent = LivestreamComponent;


/***/ },

/***/ 525:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var NotificationBannerService_1 = __webpack_require__(72);
var NotificationBannerComponent = (function () {
    function NotificationBannerComponent(notificationBannerService) {
        var _this = this;
        this.notificationBannerService = notificationBannerService;
        this.WORDS_PER_SECOND = 200 / 60;
        this.hasNotification = false;
        this.notification = "";
        notificationBannerService.notifications.subscribe(function (message) {
            _this.hasNotification = true;
            _this.notification = message;
            var defaultTime = 2000;
            var excessTime = Math.round((message.split(" ").length / _this.WORDS_PER_SECOND) * 1000);
            window.setTimeout(function () {
                _this.hasNotification = false;
                _this.notification = "";
            }, defaultTime + excessTime);
        });
    }
    NotificationBannerComponent = __decorate([
        core_1.Component({
            selector: 'tmt-notification-banner',
            template: "\n    <div class=\"notification-banner\" [style.active]=\"hasNotification\">\n        <p>{{ notification }}</p>\n    </div>\n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof NotificationBannerService_1.NotificationBannerService !== 'undefined' && NotificationBannerService_1.NotificationBannerService) === 'function' && _a) || Object])
    ], NotificationBannerComponent);
    return NotificationBannerComponent;
    var _a;
}());
exports.NotificationBannerComponent = NotificationBannerComponent;


/***/ },

/***/ 526:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var WebsocketService_1 = __webpack_require__(73);
var NotificationBannerService_1 = __webpack_require__(72);
var LaunchDataService_1 = __webpack_require__(49);
var AppDataService_1 = __webpack_require__(71);
var SettingsSection;
(function (SettingsSection) {
    SettingsSection[SettingsSection["Display"] = 0] = "Display";
    SettingsSection[SettingsSection["Notifications"] = 1] = "Notifications";
    SettingsSection[SettingsSection["General"] = 2] = "General";
    SettingsSection[SettingsSection["Countdown"] = 3] = "Countdown";
    SettingsSection[SettingsSection["Introduction"] = 4] = "Introduction";
    SettingsSection[SettingsSection["DescriptionSections"] = 5] = "DescriptionSections";
    SettingsSection[SettingsSection["Resources"] = 6] = "Resources";
    SettingsSection[SettingsSection["LaunchEventTemplates"] = 7] = "LaunchEventTemplates";
    SettingsSection[SettingsSection["About"] = 8] = "About";
})(SettingsSection || (SettingsSection = {}));
var SettingsComponent = (function () {
    function SettingsComponent(websocketService, notificationBannerService, launchData, appData) {
        this.websocketService = websocketService;
        this.notificationBannerService = notificationBannerService;
        this.launchData = launchData;
        this.appData = appData;
        this.settingsSection = SettingsSection;
        this.currentSection = this.settingsSection.General;
        this.settingsState = {
            isLiftingOff: false,
            isSaving: false,
            tempCountdown: null
        };
    }
    /**
     * On component initialization,
     */
    SettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.launchData.launchObservable().subscribe(function (data) {
            _this.launch = Object.assign({}, data);
        });
        this.websocketService.appStatusResponsesStream().subscribe(function (response) {
            _this.settingsState.isLiftingOff = false;
            _this.notificationBannerService.notify("App Enabled.");
            _this.launchData.launch = _this.launch;
        });
    };
    /**
     * Functionality to activate the T Minus Ten app. Is called by clicking the `launch` button from within the settings
     * menu. Emits an `appStatus` to the server of type "enableApp".
     */
    SettingsComponent.prototype.liftoff = function () {
        var data = {
            name: this.launch.name,
            countdown: this.launch.countdown.toISOString(),
            introduction: this.launch.introduction,
            resources: this.launch.resources,
            descriptionSections: this.launch.descriptionSections
        };
        this.settingsState.isLiftingOff = true;
        this.websocketService.emitAppStatus("enableApp", data);
    };
    /**
     * Called when the countdown date within the countdowns tab is adjusted. Sets the `countdown` field on the
     * local `launch` property.
     *
     * @param newCountdown {Date} The new temporary countdown value.
     */
    SettingsComponent.prototype.onCountdownChanged = function (newCountdown) {
        this.launch.countdown = newCountdown;
    };
    /**
     * Adds a description section to the array of description sections.
     */
    SettingsComponent.prototype.addDescriptionSection = function () {
        var descriptionSection = {
            title: null,
            description: null
        };
        if (!this.launch.descriptionSections) {
            this.launch.descriptionSections = [];
        }
        this.launch.descriptionSections.push(descriptionSection);
    };
    /**
     * Removes the given description section from the description sections array.
     *
     * @param descriptionSection {DescriptionSection} The section to remove.
     */
    SettingsComponent.prototype.removeDescriptionSection = function (descriptionSection) {
        var index = this.launch.descriptionSections.indexOf(descriptionSection);
        this.launch.descriptionSections.splice(index, 1);
    };
    /**
     * Adds a resource to the array of resources.
     */
    SettingsComponent.prototype.addResource = function () {
        var resource = {
            title: null,
            url: null,
            note: null
        };
        if (!this.launch.resources) {
            this.launch.resources = [];
        }
        this.launch.resources.push(resource);
    };
    /**
     * Removes the given resource from the resources array.
     *
     * @param resource {Resource} The resource to remove.
     */
    SettingsComponent.prototype.removeResource = function (resource) {
        var index = this.launch.resources.indexOf(resource);
        this.launch.resources.splice(index, 1);
    };
    SettingsComponent = __decorate([
        core_1.Component({
            selector: 'tmt-settings',
            template: "\n        <i [hidden]=\"!appData.isActive\" (click)=\"appData.isSettingsVisible = false\">Close</i>\n        <div>\n            <nav>\n                <ul>\n                    <li (click)=\"currentSection = settingsSection.Display\">Display</li>\n                    <li (click)=\"currentSection = settingsSection.Notifications\">Notifications</li>\n                    <li (click)=\"currentSection = settingsSection.General\">General</li>\n                    <li (click)=\"currentSection = settingsSection.Countdown\">Countdown</li>\n                    <li (click)=\"currentSection = settingsSection.Introduction\">Introduction</li>\n                    <li (click)=\"currentSection = settingsSection.DescriptionSections\">Description Sections</li>\n                    <li (click)=\"currentSection = settingsSection.Resources\">Resources</li>\n                    <li (click)=\"currentSection = settingsSection.LaunchEventTemplates\">Launch Event Templates</li>\n                    <li (click)=\"currentSection = settingsSection.About\">About the App</li>\n                </ul>\n            </nav>\n            \n            <!-- DISPLAY -->\n            <section [hidden]=\"currentSection != settingsSection.Display\">\n                <h1>Display</h1>\n                \n                <p>Increase text size</p>\n                <p>Density settings</p>\n            </section>\n            \n            <!-- NOTIFICATIONS -->\n            <section [hidden]=\"currentSection != settingsSection.Notifications\">\n                <h1>Notifications</h1>\n                \n                <p>Play ping when a new update arrives when tab inactive</p>\n            </section>\n            \n            <!-- GENERAL -->\n            <section [hidden]=\"currentSection != settingsSection.General\">\n                <h1>General</h1>\n                <p>General launch details and application settings.</p>\n                \n                <p *ngIf=\"launch.name\">Will appear on Reddit as: <span class=\"title\">r/SpaceX {{ launch.name }} Official Launch Discussion & Updates Thread</span></p>\n                <form>\n                    <label for=\"mission\">Mission Name</label>\n                    <input type=\"text\" name=\"mission\" [(ngModel)]=\"launch.name\" placeholder=\"Mission Name\">\n                </form>\n            </section>\n            \n            <!-- COUNTDOWN -->\n            <section [hidden]=\"currentSection != settingsSection.Countdown\">\n                <h1>Countdown</h1>\n                \n                <form>\n                    <tmt-datetimeentry [id]=\"'countdown'\" [date]=\"launch.countdown\" (dateChange)=\"onCountdownChanged($event)\"></tmt-datetimeentry>\n                </form>\n                \n                <p *ngIf=\"launchData.launch?.countdown != launch.countdown\">New countdown of {{ launch.countdown.toISOString() }}</p>\n            </section>\n            \n            <!-- INTRODUCTION -->\n            <section [hidden]=\"currentSection != settingsSection.Introduction\">\n                <h1>Introduction</h1>\n                <form>\n                    <textarea name=\"introduction\" [(ngModel)]=\"launch.introduction\" placeholder=\"Introductory paragraph about the launch.\"></textarea>\n                    <span>{{ launch.introduction?.length }} + characters.</span>\n                </form>\n            </section>\n            \n            <!-- DESCRIPTION SECTIONS -->\n            <section [hidden]=\"currentSection != settingsSection.DescriptionSections\">\n                <h1>Description Sections</h1>\n                \n                <button (click)=\"addDescriptionSection()\">Add Section</button>\n                \n                <ng-container *ngFor=\"let section of launch.descriptionSections\">\n                    <input type=\"text\" placeholder=\"Section title\" [(ngModel)]=\"section.title\" />\n                    <textarea placeholder=\"Section description\" [(ngModel)]=\"section.description\" ></textarea>\n                    <button (click)=\"removeDescriptionSection(section)\">Remove</button>\n                </ng-container>\n            </section>\n            \n            <!-- RESOURCES -->\n            <section [hidden]=\"currentSection != settingsSection.Resources\">\n                <h1>Resources</h1>\n                \n                <button (click)=\"addResource()\">Add Resource</button>\n                \n                <ng-container *ngFor=\"let resource of launch.resources\">\n                    <input type=\"text\" placeholder=\"Resource Title\" [(ngModel)]=\"resource.title\" />\n                    <input type=\"text\" placeholder=\"Resource URL\" [(ngModel)]=\"resource.url\" />\n                    <input type=\"text\" placeholder=\"Resource Note\" [(ngModel)]=\"resource.note\" />          \n                    <button (click)=\"removeResource(resource)\">Remove</button>\n                </ng-container>\n            </section>\n            \n            <!-- LAUNCH EVENT TEMPLATES -->\n            <section [hidden]=\"currentSection != settingsSection.LaunchEventTemplates\">\n                <h1>Launch Event Templates</h1>\n            </section>\n            \n            <!-- ABOUT -->\n            <section [hidden]=\"currentSection != settingsSection.About\">\n                <h1>About the App</h1>\n                <p>Written by Luke. View on GitHub here: https://github.com/LukeNZ/tminusten.</p>\n            </section>\n            \n            <!-- GLOBAL SETTINGS OPTIONS -->\n            <div>\n                <button (click)=\"liftoff()\" [disabled]=\"settingsState.isLiftingOff\">\n                    {{ settingsState.isLiftingOff ? \"Lifting off...\" : \"Liftoff\" }}\n                </button>\n            </div>\n        </div>\n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof WebsocketService_1.WebsocketService !== 'undefined' && WebsocketService_1.WebsocketService) === 'function' && _a) || Object, (typeof (_b = typeof NotificationBannerService_1.NotificationBannerService !== 'undefined' && NotificationBannerService_1.NotificationBannerService) === 'function' && _b) || Object, (typeof (_c = typeof LaunchDataService_1.LaunchDataService !== 'undefined' && LaunchDataService_1.LaunchDataService) === 'function' && _c) || Object, (typeof (_d = typeof AppDataService_1.AppDataService !== 'undefined' && AppDataService_1.AppDataService) === 'function' && _d) || Object])
    ], SettingsComponent);
    return SettingsComponent;
    var _a, _b, _c, _d;
}());
exports.SettingsComponent = SettingsComponent;


/***/ },

/***/ 527:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var WebsocketService_1 = __webpack_require__(73);
var AuthService_1 = __webpack_require__(40);
var NotificationBannerService_1 = __webpack_require__(72);
var LaunchDataService_1 = __webpack_require__(49);
var StatusBarComponent = (function () {
    function StatusBarComponent(authData, launchData, websocketService, notificationBannerService) {
        this.authData = authData;
        this.launchData = launchData;
        this.websocketService = websocketService;
        this.notificationBannerService = notificationBannerService;
        this.typing = [];
    }
    /**
     *
     */
    StatusBarComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.authData.isLoggedIn) {
            this.websocketService.typingStatusesStream().subscribe(function (websocket) {
            });
            this.websocketService.launchStatusResponsesStream().subscribe(function (websocket) {
                _this.notificationBannerService.notify("Launch Status Posted.");
            });
        }
    };
    /**
     *
     * @param key
     */
    StatusBarComponent.prototype.onEnterKeypress = function (key) {
        if (key === "Enter") {
            this.websocketService.emitLaunchStatusCreate(this.status, "update");
            this.status = "";
            return false;
        }
    };
    StatusBarComponent = __decorate([
        core_1.Component({
            selector: 'tmt-statusbar',
            template: "\n        <textarea class=\"status-entry\" (keypress)=\"onEnterKeypress($event.key)\" placeholder=\"Type launch updates here. Hit enter to send.\" [(ngModel)]=\"status\"></textarea>\n        <div class=\"typers\">\n            <span *ngFor=\"let typer of typing\">{{ typer }}</span>\n        </div>\n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof AuthService_1.AuthService !== 'undefined' && AuthService_1.AuthService) === 'function' && _a) || Object, (typeof (_b = typeof LaunchDataService_1.LaunchDataService !== 'undefined' && LaunchDataService_1.LaunchDataService) === 'function' && _b) || Object, (typeof (_c = typeof WebsocketService_1.WebsocketService !== 'undefined' && WebsocketService_1.WebsocketService) === 'function' && _c) || Object, (typeof (_d = typeof NotificationBannerService_1.NotificationBannerService !== 'undefined' && NotificationBannerService_1.NotificationBannerService) === 'function' && _d) || Object])
    ], StatusBarComponent);
    return StatusBarComponent;
    var _a, _b, _c, _d;
}());
exports.StatusBarComponent = StatusBarComponent;


/***/ },

/***/ 528:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var AuthService_1 = __webpack_require__(40);
var NotificationBannerService_1 = __webpack_require__(72);
var LaunchDataService_1 = __webpack_require__(49);
var AppDataService_1 = __webpack_require__(71);
var TMinusTenComponent = (function () {
    /**
     * Construct globally available services.
     *
     * @param authData
     * @param notificationBannerService
     * @param launchData
     * @param appData
     */
    function TMinusTenComponent(authData, notificationBannerService, launchData, appData) {
        this.authData = authData;
        this.notificationBannerService = notificationBannerService;
        this.launchData = launchData;
        this.appData = appData;
    }
    TMinusTenComponent = __decorate([
        core_1.Component({
            selector: 'body',
            template: "\n        <tmt-notification-banner></tmt-notification-banner>\n        <router-outlet></router-outlet>\n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof AuthService_1.AuthService !== 'undefined' && AuthService_1.AuthService) === 'function' && _a) || Object, (typeof (_b = typeof NotificationBannerService_1.NotificationBannerService !== 'undefined' && NotificationBannerService_1.NotificationBannerService) === 'function' && _b) || Object, (typeof (_c = typeof LaunchDataService_1.LaunchDataService !== 'undefined' && LaunchDataService_1.LaunchDataService) === 'function' && _c) || Object, (typeof (_d = typeof AppDataService_1.AppDataService !== 'undefined' && AppDataService_1.AppDataService) === 'function' && _d) || Object])
    ], TMinusTenComponent);
    return TMinusTenComponent;
    var _a, _b, _c, _d;
}());
exports.TMinusTenComponent = TMinusTenComponent;


/***/ },

/***/ 529:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var UpdatesComponent = (function () {
    function UpdatesComponent() {
    }
    UpdatesComponent = __decorate([
        core_1.Component({
            selector: 'tmt-updates',
            template: "\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], UpdatesComponent);
    return UpdatesComponent;
}());
exports.UpdatesComponent = UpdatesComponent;


/***/ },

/***/ 530:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var router_1 = __webpack_require__(112);
var Home_component_1 = __webpack_require__(382);
var Login_component_1 = __webpack_require__(383);
var appRoutes = [
    { path: '', component: Home_component_1.HomeComponent },
    { path: 'login', component: Login_component_1.LoginComponent }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
exports.routedComponents = [Home_component_1.HomeComponent];


/***/ },

/***/ 586:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var platform_browser_dynamic_1 = __webpack_require__(113);
var app_module_1 = __webpack_require__(409);
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule)
    .then(function (success) { return console.log("Bootstrap success"); })
    .catch(function (error) { return console.log(error); });


/***/ },

/***/ 71:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var WebsocketService_1 = __webpack_require__(73);
var AppDataService = (function () {
    /**
     *
     * @param websocketService
     */
    function AppDataService(websocketService) {
        var _this = this;
        this.websocketService = websocketService;
        // Is the settings pane open?
        this.isSettingsVisible = false;
        this.isLoading = false;
        this.websocketService.appStatusResponsesStream().subscribe(function (websocket) {
            if (websocket.response.statusType === "enableApp") {
                _this.isActive = true;
                _this.isSettingsVisible = false;
            }
        });
        this.websocketService.appStatusesStream().subscribe(function (websocket) {
            if (websocket.statusType === "enableApp") {
                _this.isActive = true;
            }
        });
    }
    AppDataService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof WebsocketService_1.WebsocketService !== 'undefined' && WebsocketService_1.WebsocketService) === 'function' && _a) || Object])
    ], AppDataService);
    return AppDataService;
    var _a;
}());
exports.AppDataService = AppDataService;


/***/ },

/***/ 72:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var Subject_1 = __webpack_require__(28);
var NotificationBannerService = (function () {
    function NotificationBannerService() {
        this.notifySubject = new Subject_1.Subject();
        this.notificationsObservable = this.notifySubject.asObservable();
    }
    /**
     * Notify subscribers of the notification banner service of a new notification.
     *
     * @param message   The message contained within the notification.
     */
    NotificationBannerService.prototype.notify = function (message) {
        this.notifySubject.next(message);
    };
    Object.defineProperty(NotificationBannerService.prototype, "notifications", {
        /**
         * Return the notification stream that can be subscribed to. Only entities that want to listen
         * for new notifications should subscribe to this.
         *
         * @returns {Observable<string>}    A stream of notifications.
         */
        get: function () {
            return this.notificationsObservable;
        },
        enumerable: true,
        configurable: true
    });
    NotificationBannerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], NotificationBannerService);
    return NotificationBannerService;
}());
exports.NotificationBannerService = NotificationBannerService;


/***/ },

/***/ 73:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var Observable_1 = __webpack_require__(4);
var AuthService_1 = __webpack_require__(40);
var io = __webpack_require__(297);
var WebsocketService = (function () {
    /**
     * Construct an instance of the websocket service. Automatically connect to the websocket
     * server, and emit a join message. Depending on whether the user is authed or not, include
     * the authentication token with the message.
     *
     * @param authService
     */
    function WebsocketService(authService) {
        this.authService = authService;
        this.socketClient = null;
        this.socketClient = io.connect("localhost:3001");
        if (authService.isLoggedIn) {
            this.socketClient.emit('msg:join', { token: authService.authtoken });
        }
        else {
            this.socketClient.emit('msg:join', {});
        }
    }
    /**
     * Sends a typing status notification up to the server.
     *
     * @param typingStatus
     */
    WebsocketService.prototype.emitTypingStatus = function (typingStatus) {
        this.socketClient.emit("msg:typingStatus", {
            token: this.authService.authtoken,
            isTyping: typingStatus
        });
    };
    /**
     * An observable stream of typing status messages received from the server.
     *
     * @returns {Observable<any>}
     */
    WebsocketService.prototype.typingStatusesStream = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socketClient.on('msg:typingStatus', function (data) { return observer.next(data); });
            return function () { return _this.socketClient.disconnect(); };
        });
    };
    /**
     * Sends a launch status creation notification up to the server.
     *
     * @param launchStatus {string} A string to create a new launch status from.
     * @param statusType {string} The type of status being sent up.
     * @param eventType {string?} Optional parameter indicating the type of event being created if
     * the launchStatus is of type "update"
     */
    WebsocketService.prototype.emitLaunchStatusCreate = function (launchStatus, statusType, eventType) {
        var data = {
            token: this.authService.authtoken,
            statusType: statusType,
            text: launchStatus
        };
        if (eventType != null) {
            data.eventType = eventType;
        }
        this.socketClient.emit("msg:launchStatusCreate", data);
    };
    /**
     * An observable stream of launch status messages received from the server.
     *
     * @returns {Observable<Status>}
     */
    WebsocketService.prototype.launchStatusesStream = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socketClient.on('msg:launchStatusCreate', function (data) { return observer.next(data); });
            return function () { return _this.socketClient.disconnect(); };
        });
    };
    /**
     * An observable stream of launch status responses received from the server. Used
     * to confirm that a launch status emitted to the server was acknowledged.
     *
     * @returns {Observable<WebsocketResponse>}
     */
    WebsocketService.prototype.launchStatusResponsesStream = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socketClient.on('response:launchStatusCreate', function (data) { return observer.next(data); });
            return function () { return _this.socketClient.disconnect(); };
        });
    };
    /**
     * Emits a request, or a cancellation of a request, to edit a launch status to the server.
     *
     * @param launchStatus {Status} The status an edit request has been made for.
     * @param isRequesting {boolean} true if the client is requesting edit rights, false if the
     * client is cancelling their already granted edit rights.
     */
    WebsocketService.prototype.emitLaunchStatusEditRequest = function (launchStatus, isRequesting) {
        this.socketClient.emit("msg:launchStatusCreate", {
            token: this.authService.authtoken,
            statusId: launchStatus.statusId,
            isRequesting: isRequesting
        });
    };
    /**
     * An observable stream of launch status edit requests and cancellations received
     * from the server.
     *
     * @returns {Observable<any>}
     */
    WebsocketService.prototype.launchStatusEditRequestsStream = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socketClient.on('msg:launchStatusEditRequest', function (data) { return observer.next(data); });
            return function () { return _this.socketClient.disconnect(); };
        });
    };
    /**
     * Emits a request to the server when a launch status is edited.
     *
     * @param launchStatus {Status} The launch status being edited.
     * @param replacementText {string} The replacement text to edit into the launch status.
     */
    WebsocketService.prototype.emitLaunchStatusEdit = function (launchStatus, replacementText) {
        this.socketClient.emit("msg:launchStatusEdit", {
            token: this.authService.authtoken,
            statusId: launchStatus.statusId,
            text: replacementText
        });
    };
    /**
     * An observable stream of launch status edits received from the server.
     *
     * @returns {Observable<any>}
     */
    WebsocketService.prototype.launchStatusEditsStream = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socketClient.on('msg:launchStatusEdit', function (data) { return observer.next(data); });
            return function () { return _this.socketClient.disconnect(); };
        });
    };
    /**
     * An observable stream of launch status edit responses received from the server. Used
     * to confirm that a launch status edit emitted to the server was acknowledged.
     *
     * @returns {Observable<WebsocketResponse>}
     */
    WebsocketService.prototype.launchStatusEditResponsesStream = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socketClient.on('response:launchStatusEdit', function (data) { return observer.next(data); });
            return function () { return _this.socketClient.disconnect(); };
        });
    };
    /**
     * Emits a request to the server when a launch status is deleted.
     *
     * @param launchStatus {Status} The launch status being deleted.
     */
    WebsocketService.prototype.emitLaunchStatusDelete = function (launchStatus) {
        this.socketClient.emit("msg:launchStatusDelete", {
            token: this.authService.authtoken,
            statusId: launchStatus.statusId
        });
    };
    /**
     * An observable stream of launch status deletions received from the server.
     *
     * @returns {Observable<any>}
     */
    WebsocketService.prototype.launchStatusDeletionsStream = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socketClient.on('msg:launchStatusDelete', function (data) { return observer.next(data); });
            return function () { return _this.socketClient.disconnect(); };
        });
    };
    /**
     * An observable stream of launch status deletion responses received from the server. Used
     * to confirm that a launch status deletion emitted to the server was acknowledged.
     *
     * @returns {Observable<WebsocketResponse>}
     */
    WebsocketService.prototype.launchStatusDeletionsResponsesStream = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socketClient.on('response:launchStatusDelete', function (data) { return observer.next(data); });
            return function () { return _this.socketClient.disconnect(); };
        });
    };
    /**
     * Emit a app status to the server. This includes statuses such as `enableApp`, `disableApp`,
     * `editLivestream`, `editLaunch`, and `editEvent`.
     *
     * @param statusType {string} One of `enableApp`, `disableApp`,`editLivestream`,
     * `editLaunch`, and `editEvent`.
     * @param data {*} Data to be sent up to the server as payload.
     */
    WebsocketService.prototype.emitAppStatus = function (statusType, data) {
        if (!data) {
            data = {};
        }
        this.socketClient.emit("msg:appStatus", {
            token: this.authService.authtoken,
            statusType: statusType,
            data: data
        });
    };
    /**
     * An observable stream of app statuses indicating changes to the state and functionality
     * of the application.
     *
     * @returns {Observable<any>}
     */
    WebsocketService.prototype.appStatusesStream = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socketClient.on('msg:appStatus', function (data) { return observer.next(data); });
            return function () { return _this.socketClient.disconnect(); };
        });
    };
    /**
     * An observably stream of app status responses used to confirm when an appStatus message
     * sent by the client is acknowledged by the server.
     *
     * @returns {Observable<WebsocketResponse>}
     */
    WebsocketService.prototype.appStatusResponsesStream = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socketClient.on('response:appStatus', function (data) { return observer.next(data); });
            return function () { return _this.socketClient.disconnect(); };
        });
    };
    WebsocketService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof AuthService_1.AuthService !== 'undefined' && AuthService_1.AuthService) === 'function' && _a) || Object])
    ], WebsocketService);
    return WebsocketService;
    var _a;
}());
exports.WebsocketService = WebsocketService;


/***/ }

},[586]);