webpackJsonp([0],{

/***/ 121:
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
var Subject_1 = __webpack_require__(31);
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

/***/ 193:
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
var Observable_1 = __webpack_require__(5);
var AuthService_1 = __webpack_require__(80);
var io = __webpack_require__(223);
var uuid = __webpack_require__(221);
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
     * @param launchStatus A string to create a new launch status from.
     */
    WebsocketService.prototype.emitLaunchStatusCreate = function (launchStatus) {
        this.socketClient.emit("msg:launchStatusCreate", {
            token: this.authService.authtoken,
            text: launchStatus
        });
    };
    /**
     * An observable stream of launch status messages received from the server.
     *
     * @returns {Observable<any>}
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
     * @returns {Observable<any>}
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
            status_id: launchStatus.status_id,
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
            status_id: launchStatus.status_id,
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
     * @returns {Observable<any>}
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
            status_id: launchStatus.status_id
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
     * @returns {Observable<any>}
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
        var _this = this;
        if (!data) {
            data = {};
        }
        this.socketClient.emit("msg:appStatus", {
            token: this.authService.authtoken,
            statusType: statusType,
            data: data
        });
        return new Observable_1.Observable(function (observer) {
            _this.socketClient.on('response:appStatus', observer.next);
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


/***/ },

/***/ 312:
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
var platform_browser_1 = __webpack_require__(37);
var InitializationService_1 = __webpack_require__(315);
var WebsocketService_1 = __webpack_require__(193);
var AuthService_1 = __webpack_require__(80);
var LaunchDataService_1 = __webpack_require__(81);
var Observable_1 = __webpack_require__(5);
__webpack_require__(222);
var HomeComponent = (function () {
    function HomeComponent(initializationService, authService, websocketService, launchModel, titleService) {
        this.initializationService = initializationService;
        this.authService = authService;
        this.websocketService = websocketService;
        this.launchModel = launchModel;
        this.titleService = titleService;
        this.isLoading = true;
        this.titleService.setTitle("T Minus Ten");
    }
    /**
     * On component initialization, make three calls to fetch data from the server, so we are
     * up to date with respect to the current application's state.
     */
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        Observable_1.Observable.forkJoin(this.initializationService.getLaunch(), this.initializationService.getUpdates(), this.initializationService.getStatus()).subscribe(function (data) {
            _this.launchModel.setLaunch(data[0]);
            _this.launchModel.setStatuses(data[1]);
            _this.launchModel.isActive = data[2].isActive;
            _this.isLoading = false;
        });
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'tmt-home',
            template: "\n        <p *ngIf=\"isLoading\">Loading...</p>\n        \n        <!-- Only show the below contents if the application has loaded. -->\n        <template [ngIf]=\"!isLoading\">\n        \n            <!-- Only show if the application is not active. -->\n            <template [ngIf]=\"!launchModel.isActive\">\n            \n                <!-- Allow a logged in user to access the application settings to start a launch. -->\n                <template [ngIf]=\"authService.isLoggedIn\">\n                    <tmt-settings></tmt-settings>\n                </template>\n                \n                <!-- If the application is not active, and the user is a visitor, \n                show the default message. -->\n                <template [ngIf]=\"!authService.isLoggedIn\">\n                    <p>There is no active launch at this time. Check back soon!</p>\n                </template>\n            </template>\n            \n            <!-- Show if the application is active. -->\n            <template [ngIf]=\"launchModel.isActive\">\n                <tmt-header></tmt-header>\n                <tmt-webcast></tmt-webcast>\n                <tmt-statusbar></tmt-statusbar>\n                <tmt-updates></tmt-updates>\n            </template>  \n             \n        </template>     \n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof InitializationService_1.InitializationService !== 'undefined' && InitializationService_1.InitializationService) === 'function' && _a) || Object, (typeof (_b = typeof AuthService_1.AuthService !== 'undefined' && AuthService_1.AuthService) === 'function' && _b) || Object, (typeof (_c = typeof WebsocketService_1.WebsocketService !== 'undefined' && WebsocketService_1.WebsocketService) === 'function' && _c) || Object, (typeof (_d = typeof LaunchDataService_1.LaunchDataService !== 'undefined' && LaunchDataService_1.LaunchDataService) === 'function' && _d) || Object, (typeof (_e = typeof platform_browser_1.Title !== 'undefined' && platform_browser_1.Title) === 'function' && _e) || Object])
    ], HomeComponent);
    return HomeComponent;
    var _a, _b, _c, _d, _e;
}());
exports.HomeComponent = HomeComponent;


/***/ },

/***/ 313:
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
var AuthService_1 = __webpack_require__(80);
var router_1 = __webpack_require__(133);
var platform_browser_1 = __webpack_require__(37);
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

/***/ 314:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var http_1 = __webpack_require__(62);
var Observable_1 = __webpack_require__(5);
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

/***/ 315:
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
var http_1 = __webpack_require__(62);
var AbstractService_1 = __webpack_require__(314);
var Launch_1 = __webpack_require__(480);
var InitializationService = (function (_super) {
    __extends(InitializationService, _super);
    function InitializationService(http) {
        _super.call(this);
        this.http = http;
    }
    /**
     * Fetches the status of the application.
     *
     * @returns {Observable<R>}
     */
    InitializationService.prototype.getStatus = function () {
        return this.http.get('/api/status', this.headers())
            .map(this.extractData);
    };
    /**
     * Fetches all current launch updates from the server.
     *
     * @returns {Observable<Status[]>}
     */
    InitializationService.prototype.getUpdates = function () {
        return this.http.get('/api/updates', this.headers())
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

/***/ 361:
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
var platform_browser_1 = __webpack_require__(37);
var http_1 = __webpack_require__(62);
var TMinusTen_component_1 = __webpack_require__(486);
var Header_component_1 = __webpack_require__(482);
var Countdown_component_1 = __webpack_require__(481);
var StatusBar_component_1 = __webpack_require__(485);
var Updates_component_1 = __webpack_require__(487);
var Webcast_component_1 = __webpack_require__(488);
var app_routes_1 = __webpack_require__(489);
var Home_component_1 = __webpack_require__(312);
var InitializationService_1 = __webpack_require__(315);
var WebsocketService_1 = __webpack_require__(193);
var Login_component_1 = __webpack_require__(313);
var NotificationBanner_component_1 = __webpack_require__(483);
var forms_1 = __webpack_require__(220);
var AuthService_1 = __webpack_require__(80);
var LaunchDataService_1 = __webpack_require__(81);
var Settings_component_1 = __webpack_require__(484);
var NotificationBannerService_1 = __webpack_require__(121);
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, http_1.HttpModule, forms_1.FormsModule, app_routes_1.routing],
            providers: [InitializationService_1.InitializationService, WebsocketService_1.WebsocketService, AuthService_1.AuthService, LaunchDataService_1.LaunchDataService, NotificationBannerService_1.NotificationBannerService],
            declarations: [TMinusTen_component_1.TMinusTenComponent, Home_component_1.HomeComponent, Login_component_1.LoginComponent, Header_component_1.HeaderComponent, Countdown_component_1.CountdownComponent, StatusBar_component_1.StatusBarComponent,
                Updates_component_1.UpdatesComponent, Webcast_component_1.WebcastComponent, NotificationBanner_component_1.NotificationBannerComponent, Settings_component_1.SettingsComponent],
            bootstrap: [TMinusTen_component_1.TMinusTenComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;


/***/ },

/***/ 480:
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
        this.name = name;
        this.beganAt = beganAt;
        this.countdown = countdown;
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

/***/ 481:
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
var LaunchDataService_1 = __webpack_require__(81);
var CountdownComponent = (function () {
    function CountdownComponent(launchData) {
        this.launchData = launchData;
    }
    CountdownComponent.prototype.ngOnInit = function () {
        setInterval(this.countdownProcessor(), 1000);
    };
    /**
     *
     */
    CountdownComponent.prototype.countdownProcessor = function () {
        if (!this.launchData.launch.isPaused) {
            var relativeSecondsBetween = (((+new Date()) - +this.launchData.launch.countdown) / 1000);
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

/***/ 482:
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
var HeaderComponent = (function () {
    function HeaderComponent() {
    }
    HeaderComponent = __decorate([
        core_1.Component({
            selector: 'tmt-header',
            template: "\n        <div class=\"header-area\">\n            <tmt-countdown></tmt-countdown>\n            \n        </div>       \n    "
        }), 
        __metadata('design:paramtypes', [])
    ], HeaderComponent);
    return HeaderComponent;
}());
exports.HeaderComponent = HeaderComponent;


/***/ },

/***/ 483:
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
var NotificationBannerService_1 = __webpack_require__(121);
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

/***/ 484:
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
var WebsocketService_1 = __webpack_require__(193);
var NotificationBannerService_1 = __webpack_require__(121);
var LaunchDataService_1 = __webpack_require__(81);
var SettingsSection;
(function (SettingsSection) {
    SettingsSection[SettingsSection["Display"] = 0] = "Display";
    SettingsSection[SettingsSection["Notifications"] = 1] = "Notifications";
    SettingsSection[SettingsSection["General"] = 2] = "General";
    SettingsSection[SettingsSection["Countdown"] = 3] = "Countdown";
    SettingsSection[SettingsSection["Introduction"] = 4] = "Introduction";
    SettingsSection[SettingsSection["DescriptionSections"] = 5] = "DescriptionSections";
    SettingsSection[SettingsSection["Resources"] = 6] = "Resources";
    SettingsSection[SettingsSection["LaunchStatuses"] = 7] = "LaunchStatuses";
    SettingsSection[SettingsSection["About"] = 8] = "About";
})(SettingsSection || (SettingsSection = {}));
var SettingsComponent = (function () {
    function SettingsComponent(websocketService, notificationBannerService, launchModel) {
        this.websocketService = websocketService;
        this.notificationBannerService = notificationBannerService;
        this.launchModel = launchModel;
        this.settingsSection = SettingsSection;
        this.currentSection = this.settingsSection.General;
        this.settingsState = {
            isLaunching: false,
            isSaving: false
        };
    }
    /**
     * Functionality to activate the T Minus Ten app. Is called by clicking the `launch` button from within the settings
     * menu. Emits an `appStatus` to the server of type "enableApp".
     */
    SettingsComponent.prototype.launch = function () {
        var _this = this;
        this.settingsState.isLaunching = true;
        this.websocketService.emitAppStatus("enableApp", { missionName: this.launchModel.launch.name }).subscribe(function (response) {
            _this.settingsState.isLaunching = false;
            _this.notificationBannerService.notify("App Enabled.");
        });
    };
    SettingsComponent = __decorate([
        core_1.Component({
            selector: 'tmt-settings',
            template: "\n        <div>\n            <nav>\n                <ul>\n                    <li (click)=\"currentSection = settingsSection.Display\">Display</li>\n                    <li (click)=\"currentSection = settingsSection.Notifications\">Notifications</li>\n                    <li (click)=\"currentSection = settingsSection.General\">General</li>\n                    <li (click)=\"currentSection = settingsSection.Countdown\">Countdown</li>\n                    <li (click)=\"currentSection = settingsSection.Introduction\">Introduction</li>\n                    <li (click)=\"currentSection = settingsSection.DescriptionSections\">Description Sections</li>\n                    <li (click)=\"currentSection = settingsSection.Resources\">Resources</li>\n                    <li (click)=\"currentSection = settingsSection.LaunchStatuses\">Launch Statuses</li>\n                    <li (click)=\"currentSection = settingsSection.About\">About the App</li>\n                </ul>\n            </nav>\n            \n            <section [hidden]=\"currentSection != settingsSection.Display\">\n                <h1>Display</h1>\n                \n                <p>Increase text size</p>\n                <p>Density settings</p>\n            </section>\n            \n            <section [hidden]=\"currentSection != settingsSection.Notifications\">\n                <h1>Notifications</h1>\n                \n                <p>Play ping when a new update arrives when tab inactive</p>\n            </section>\n            \n            <!-- GENERAL -->\n            <section [hidden]=\"currentSection != settingsSection.General\">\n                <h1>General</h1>\n                <p>General launch details and application settings.</p>\n                \n                <p *ngIf=\"launchModel.launch.name\">Will appear on Reddit as: <span class=\"title\">r/SpaceX {{ launchModel.launch.name }} Official Launch Discussion & Updates Thread</span></p>\n                <form>\n                    <label for=\"mission\">Mission Name</label>\n                    <input type=\"text\" name=\"mission\" [(ngModel)]=\"launchModel.launch.name\" placeholder=\"Mission Name\">\n                </form>\n            </section>\n            \n            <!-- COUNTDOWN -->\n            <section [hidden]=\"currentSection != settingsSection.Countdown\">\n                <h1>Countdown</h1>\n                \n                <form>\n                    <select name=\"liftoffHour\">\n                    \n                    </select>\n                    <select name=\"liftoffMinute\">\n                    \n                    </select>\n                     <select name=\"liftoffSecond\">\n                    \n                    </select>\n                    <select name=\"liftoffDate\">\n                    \n                    </select>\n                    <select name=\"liftoffMonth\">\n                    \n                    </select>\n                    <select name=\"liftoffYear\">\n                    \n                    </select>\n                </form>\n            </section>\n            \n            <section [hidden]=\"currentSection != settingsSection.Introduction\">\n                <h1>Introduction</h1>\n                <form>\n                    <textarea name=\"introduction\" [(ngModel)]=\"launchModel.launch.introduction\" placeholder=\"Introduction.\"></textarea>\n                </form>\n            </section>\n            \n            <section [hidden]=\"currentSection != settingsSection.DescriptionSections\">\n                <h1>Description Sections</h1>\n                \n                <template ngFor let-section [ngForOf]=\"launchModel.launch.descriptionSections\">\n                    <input type=\"text\" placeholder=\"Section title\" />\n                    <textarea placeholder=\"Section description\">\n                    \n                    </textarea>\n                </template>\n            </section>\n            \n            <section [hidden]=\"currentSection != settingsSection.Resources\">\n                <h1>Resources</h1>\n            </section>\n            \n            <section [hidden]=\"currentSection != settingsSection.LaunchStatuses\">\n                <h1>Launch Statuses</h1>\n            </section>\n            \n            <section [hidden]=\"currentSection != settingsSection.About\">\n                <h1>About the App</h1>\n                <p>Written by Luke.</p>\n            </section>\n            \n            <div>\n                <button (click)=\"launch()\" [disabled]=\"settingsState.isLaunching\">\n                    {{ settingsState.isLaunching ? \"Launching...\" : \"Launch\" }}\n                </button>\n            </div>\n        </div>\n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof WebsocketService_1.WebsocketService !== 'undefined' && WebsocketService_1.WebsocketService) === 'function' && _a) || Object, (typeof (_b = typeof NotificationBannerService_1.NotificationBannerService !== 'undefined' && NotificationBannerService_1.NotificationBannerService) === 'function' && _b) || Object, (typeof (_c = typeof LaunchDataService_1.LaunchDataService !== 'undefined' && LaunchDataService_1.LaunchDataService) === 'function' && _c) || Object])
    ], SettingsComponent);
    return SettingsComponent;
    var _a, _b, _c;
}());
exports.SettingsComponent = SettingsComponent;


/***/ },

/***/ 485:
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
var StatusBarComponent = (function () {
    function StatusBarComponent() {
    }
    StatusBarComponent = __decorate([
        core_1.Component({
            selector: 'tmt-statusbar',
            template: "\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], StatusBarComponent);
    return StatusBarComponent;
}());
exports.StatusBarComponent = StatusBarComponent;


/***/ },

/***/ 486:
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
var AuthService_1 = __webpack_require__(80);
var NotificationBannerService_1 = __webpack_require__(121);
var LaunchDataService_1 = __webpack_require__(81);
var TMinusTenComponent = (function () {
    /**
     * Construct globally available services.
     *
     * @param authService
     * @param notificationBannerService
     * @param launchDataService
     */
    function TMinusTenComponent(authService, notificationBannerService, launchDataService) {
        this.authService = authService;
        this.notificationBannerService = notificationBannerService;
        this.launchDataService = launchDataService;
    }
    TMinusTenComponent = __decorate([
        core_1.Component({
            selector: 'body',
            template: "\n        <tmt-notification-banner></tmt-notification-banner>\n        <router-outlet></router-outlet>\n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof AuthService_1.AuthService !== 'undefined' && AuthService_1.AuthService) === 'function' && _a) || Object, (typeof (_b = typeof NotificationBannerService_1.NotificationBannerService !== 'undefined' && NotificationBannerService_1.NotificationBannerService) === 'function' && _b) || Object, (typeof (_c = typeof LaunchDataService_1.LaunchDataService !== 'undefined' && LaunchDataService_1.LaunchDataService) === 'function' && _c) || Object])
    ], TMinusTenComponent);
    return TMinusTenComponent;
    var _a, _b, _c;
}());
exports.TMinusTenComponent = TMinusTenComponent;


/***/ },

/***/ 487:
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

/***/ 488:
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
var WebcastComponent = (function () {
    function WebcastComponent() {
    }
    WebcastComponent = __decorate([
        core_1.Component({
            selector: 'tmt-webcast',
            template: "\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], WebcastComponent);
    return WebcastComponent;
}());
exports.WebcastComponent = WebcastComponent;


/***/ },

/***/ 489:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var router_1 = __webpack_require__(133);
var Home_component_1 = __webpack_require__(312);
var Login_component_1 = __webpack_require__(313);
var appRoutes = [
    { path: '', component: Home_component_1.HomeComponent },
    { path: 'login', component: Login_component_1.LoginComponent }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
exports.routedComponents = [Home_component_1.HomeComponent];


/***/ },

/***/ 609:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var platform_browser_dynamic_1 = __webpack_require__(134);
var app_module_1 = __webpack_require__(361);
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule)
    .then(function (success) { return console.log("Bootstrap success"); })
    .catch(function (error) { return console.log(error); });


/***/ },

/***/ 80:
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
var http_1 = __webpack_require__(62);
var AbstractService_1 = __webpack_require__(314);
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

/***/ 81:
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
var BehaviorSubject_1 = __webpack_require__(131);
var LaunchDataService = (function () {
    function LaunchDataService() {
        this._launchSubject = new BehaviorSubject_1.BehaviorSubject(this._launch);
        this._launchObservable = this._launchSubject.asObservable;
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
        enumerable: true,
        configurable: true
    });
    /**
     * Returns an observable for the launch model
     *
     * @returns {Observable<Launch>} An observable of the launch model.
     */
    LaunchDataService.prototype.launchObservable = function () {
        return this._launchObservable();
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
     * Pushes an status to the end of the updates array.
     *
     * @param status {Status} The status to append to the end of the array.
     */
    LaunchDataService.prototype.addStatus = function (status) {
        if (!this._statuses) {
            this._statuses = [];
        }
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
        __metadata('design:paramtypes', [])
    ], LaunchDataService);
    return LaunchDataService;
}());
exports.LaunchDataService = LaunchDataService;


/***/ }

},[609]);