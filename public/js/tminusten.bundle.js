webpackJsonp([0],{

/***/ 120:
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

/***/ 191:
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
var io = __webpack_require__(222);
var uuid = __webpack_require__(220);
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
     *
     * @param typingStatus
     */
    WebsocketService.prototype.emitTypingStatus = function (typingStatus) {
        this.socketClient.emit("typingStatus", typingStatus);
    };
    /**
     *
     * @param launchUpdate
     */
    WebsocketService.prototype.emitCreateLaunchUpdate = function (launchUpdate) {
        this.socketClient.emit("launchUpdate", launchUpdate);
    };
    WebsocketService.prototype.emitEditLaunchUpdate = function (launchUpdateEdit) {
    };
    WebsocketService.prototype.emitDeleteLaunchUpdate = function (launchUpdateDeletion) {
    };
    /**
     *
     * @param launchStatus
     */
    WebsocketService.prototype.emitLaunchStatus = function (launchStatus) {
        this.socketClient.emit("launchStatus", launchStatus);
    };
    /**
     * Emit a app status to the server. This includes statuses such as `enableApp`, `disableApp`,
     * `editWebcastData`, and `editLaunchData`.
     *
     * @param statusType    One of  `enableApp`, `disableApp`,`editWebcastData`, and `editLaunchData`.
     * @param data          Data to be sent up to the serveras payload.
     */
    WebsocketService.prototype.emitAppStatus = function (statusType, data) {
        var _this = this;
        var msgId = uuid.v4();
        if (!data) {
            data = {};
        }
        this.socketClient.emit("msg:appStatus", {
            token: this.authService.authtoken,
            uuid: msgId,
            statusType: statusType,
            data: data
        });
        return new Observable_1.Observable(function (observer) {
            _this.socketClient.on('response:appStatus', function (data) {
                if (data.uuid == msgId) {
                    return observer.next(data);
                }
            });
            return function () { return _this.socketClient.disconnect(); };
        });
    };
    /**
     *
     * @returns {Observable}
     */
    WebsocketService.prototype.launchUpdatesStream = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socketClient.on('launchUpdate', function (data) { return observer.next(data); });
            return function () { return _this.socketClient.disconnect(); };
        });
    };
    /**
     *
     * @returns {Observable}
     */
    WebsocketService.prototype.launchStatusesStream = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socketClient.on('launchStatus', function (data) { return observer.next(data); });
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

/***/ 311:
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
var InitializationService_1 = __webpack_require__(314);
var WebsocketService_1 = __webpack_require__(191);
var AuthService_1 = __webpack_require__(80);
var LaunchDataService_1 = __webpack_require__(610);
var Observable_1 = __webpack_require__(5);
__webpack_require__(221);
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
     * On component initialization, make three calls to fetch data from the server.
     */
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        Observable_1.Observable.forkJoin(this.initializationService.getLaunch(), this.initializationService.getUpdates(), this.initializationService.getStatus()).subscribe(function (data) {
            _this.launchModel.setLaunch(data[0]);
            _this.launchModel.setUpdates(data[1]);
            _this.launchModel.isActive = data[2];
            _this.isLoading = false;
        });
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'tmt-home',
            template: "\n        <p *ngIf=\"isLoading\">Loading...</p>\n        \n        <!-- Only show the below contents if the application has loaded. -->\n        <template [ngIf]=\"!isLoading\">\n        \n            <!-- Only show if the application is not active. -->\n            <template [ngIf]=\"!launchModel.isActive\">\n            \n                <!-- Allow a logged in user to access the application settings to start a launch. -->\n                <template [ngIf]=\"authService.isLoggedIn\">\n                    <tmt-settings></tmt-settings>\n                </template>\n                \n                <!-- If the application is not active, and the user is a visitor, \n                show the default message. -->\n                <template [ngIf]=\"!authService.isLoggedIn\">\n                    <p>There is no active launch at this time. Check back soon!</p>\n                </template>\n            </template>\n            \n            <!-- Show if the application is active. -->\n            <template [ngIf]=\"isActive\">\n                <tmt-header></tmt-header>\n                <tmt-webcast></tmt-webcast>\n                <tmt-statusbar></tmt-statusbar>\n                <tmt-updates></tmt-updates>\n            </template>  \n             \n        </template>     \n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof InitializationService_1.InitializationService !== 'undefined' && InitializationService_1.InitializationService) === 'function' && _a) || Object, (typeof (_b = typeof AuthService_1.AuthService !== 'undefined' && AuthService_1.AuthService) === 'function' && _b) || Object, (typeof (_c = typeof WebsocketService_1.WebsocketService !== 'undefined' && WebsocketService_1.WebsocketService) === 'function' && _c) || Object, (typeof (_d = typeof LaunchDataService_1.LaunchDataService !== 'undefined' && LaunchDataService_1.LaunchDataService) === 'function' && _d) || Object, (typeof (_e = typeof platform_browser_1.Title !== 'undefined' && platform_browser_1.Title) === 'function' && _e) || Object])
    ], HomeComponent);
    return HomeComponent;
    var _a, _b, _c, _d, _e;
}());
exports.HomeComponent = HomeComponent;


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
var AuthService_1 = __webpack_require__(80);
var router_1 = __webpack_require__(131);
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

/***/ 313:
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

/***/ 314:
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
var AbstractService_1 = __webpack_require__(313);
var Launch_1 = __webpack_require__(611);
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
     * @returns {Observable<Update[]>}
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

/***/ 360:
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
var TMinusTen_component_1 = __webpack_require__(484);
var Header_component_1 = __webpack_require__(480);
var Countdown_component_1 = __webpack_require__(479);
var StatusBar_component_1 = __webpack_require__(483);
var Updates_component_1 = __webpack_require__(485);
var Webcast_component_1 = __webpack_require__(486);
var app_routes_1 = __webpack_require__(488);
var Home_component_1 = __webpack_require__(311);
var InitializationService_1 = __webpack_require__(314);
var WebsocketService_1 = __webpack_require__(191);
var Login_component_1 = __webpack_require__(312);
var NotificationBanner_component_1 = __webpack_require__(481);
var forms_1 = __webpack_require__(219);
var AuthService_1 = __webpack_require__(80);
var LaunchDataService_1 = __webpack_require__(610);
var Settings_component_1 = __webpack_require__(482);
var NotificationBannerService_1 = __webpack_require__(120);
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

/***/ 479:
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
var CountdownComponent = (function () {
    function CountdownComponent() {
    }
    CountdownComponent = __decorate([
        core_1.Component({
            selector: 'tmt-countdown',
            template: "\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], CountdownComponent);
    return CountdownComponent;
}());
exports.CountdownComponent = CountdownComponent;


/***/ },

/***/ 480:
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
var NotificationBannerService_1 = __webpack_require__(120);
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
var WebsocketService_1 = __webpack_require__(191);
var NotificationBannerService_1 = __webpack_require__(120);
var LaunchDataService_1 = __webpack_require__(610);
var SettingsSection;
(function (SettingsSection) {
    SettingsSection[SettingsSection["General"] = 0] = "General";
    SettingsSection[SettingsSection["Countdown"] = 1] = "Countdown";
    SettingsSection[SettingsSection["Introduction"] = 2] = "Introduction";
    SettingsSection[SettingsSection["DescriptionSections"] = 3] = "DescriptionSections";
    SettingsSection[SettingsSection["Resources"] = 4] = "Resources";
    SettingsSection[SettingsSection["LaunchStatuses"] = 5] = "LaunchStatuses";
    SettingsSection[SettingsSection["About"] = 6] = "About";
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
            template: "\n        <div>\n            <nav>\n                <ul>\n                    <li (click)=\"currentSection = settingsSection.General\">General</li>\n                    <li (click)=\"currentSection = settingsSection.Countdown\">Countdown</li>\n                    <li (click)=\"currentSection = settingsSection.Introduction\">Introduction</li>\n                    <li (click)=\"currentSection = settingsSection.DescriptionSections\">Description Sections</li>\n                    <li (click)=\"currentSection = settingsSection.Resources\">Resources</li>\n                    <li (click)=\"currentSection = settingsSection.LaunchStatuses\">Launch Statuses</li>\n                    <li (click)=\"currentSection = settingsSection.About\">About the App</li>\n                </ul>\n            </nav>\n            \n            <!-- GENERAL -->\n            <section [hidden]=\"currentSection != settingsSection.General\">\n                <h1>General</h1>\n                <p>General launch details and application settings.</p>\n                \n                <p *ngIf=\"launchModel.launch.name\">Will appear on Reddit as: <span class=\"title\">r/SpaceX {{ launchModel.launch.name }} Official Launch Discussion & Updates Thread</span></p>\n                <form>\n                    <label for=\"missionName\">Mission Name</label>\n                    <input type=\"text\" name=\"missionName\" [(ngModel)]=\"launchModel.launch.name\" placeholder=\"Mission Name\">\n                </form>\n            </section>\n            \n            <!-- COUNTDOWN -->\n            <section [hidden]=\"currentSection != settingsSection.Countdown\">\n                <h1>Countdown</h1>\n                \n                <form>\n                    <select name=\"liftoffHour\">\n                    \n                    </select>\n                    <select name=\"liftoffMinute\">\n                    \n                    </select>\n                     <select name=\"liftoffSecond\">\n                    \n                    </select>\n                    <select name=\"liftoffDate\">\n                    \n                    </select>\n                    <select name=\"liftoffMonth\">\n                    \n                    </select>\n                    <select name=\"liftoffYear\">\n                    \n                    </select>\n                </form>\n            </section>\n            \n            <section [hidden]=\"currentSection != settingsSection.Introduction\">\n                <h1>Introduction</h1>\n                <form>\n                    <textarea [(ngModel)]=\"launchModel.launch.introduction\" placeholder=\"Introduction.\"></textarea>\n                </form>\n            </section>\n            \n            <section [hidden]=\"currentSection != settingsSection.DescriptionSections\">\n                <h1>Description Sections</h1>\n                \n                <template ngFor let-section [ngForOf]=\"launchModel.launch.descriptionSections\">\n                    <input type=\"text\" placeholder=\"Section title\" />\n                    <textarea placeholder=\"Section description\">\n                    \n                    </textarea>\n                </template>\n            </section>\n            \n            <section [hidden]=\"currentSection != settingsSection.Resources\">\n                <h1>Resources</h1>\n            </section>\n            \n            <section [hidden]=\"currentSection != settingsSection.LaunchStatuses\">\n                <h1>Launch Statuses</h1>\n            </section>\n            \n            <section [hidden]=\"currentSection != settingsSection.About\">\n                <h1>About the App</h1>\n                <p>Written by Luke.</p>\n            </section>\n            \n            <div>\n                <button (click)=\"launch()\" [disabled]=\"settingsState.isLaunching\">\n                    {{ settingsState.isLaunching ? \"Launching...\" : \"Launch\" }}\n                </button>\n            </div>\n        </div>\n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof WebsocketService_1.WebsocketService !== 'undefined' && WebsocketService_1.WebsocketService) === 'function' && _a) || Object, (typeof (_b = typeof NotificationBannerService_1.NotificationBannerService !== 'undefined' && NotificationBannerService_1.NotificationBannerService) === 'function' && _b) || Object, (typeof (_c = typeof LaunchDataService_1.LaunchDataService !== 'undefined' && LaunchDataService_1.LaunchDataService) === 'function' && _c) || Object])
    ], SettingsComponent);
    return SettingsComponent;
    var _a, _b, _c;
}());
exports.SettingsComponent = SettingsComponent;


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
var AuthService_1 = __webpack_require__(80);
var NotificationBannerService_1 = __webpack_require__(120);
var LaunchDataService_1 = __webpack_require__(610);
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

/***/ 488:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var router_1 = __webpack_require__(131);
var Home_component_1 = __webpack_require__(311);
var Login_component_1 = __webpack_require__(312);
var appRoutes = [
    { path: '', component: Home_component_1.HomeComponent },
    { path: 'login', component: Login_component_1.LoginComponent }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
exports.routedComponents = [Home_component_1.HomeComponent];


/***/ },

/***/ 608:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var platform_browser_dynamic_1 = __webpack_require__(132);
var app_module_1 = __webpack_require__(360);
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule)
    .then(function (success) { return console.log("Bootstrap success"); })
    .catch(function (error) { return console.log(error); });


/***/ },

/***/ 610:
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
var LaunchDataService = (function () {
    function LaunchDataService() {
    }
    /**
     * Sets the launch model of the service.
     *
     * @param launch
     */
    LaunchDataService.prototype.setLaunch = function (launch) {
        this._launch = launch;
    };
    Object.defineProperty(LaunchDataService.prototype, "launch", {
        /**
         * Accessor for the launch model.
         *
         * @returns {Launch}
         */
        get: function () {
            return this._launch;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the array of updates.
     *
     * @param updates
     */
    LaunchDataService.prototype.setUpdates = function (updates) {
        this._updates = updates;
    };
    /**
     * Pushes an update to the end of the updates array.
     *
     * @param update The update to append to the end of the array.
     */
    LaunchDataService.prototype.addUpdate = function (update) {
        if (!this._updates) {
            this._updates = [];
        }
        this._updates.push(update);
    };
    /**
     * Deletes an update from the updates array.
     *
     * @param update
     *
     * @returns {boolean} True if the update was deleted, false if the update was not deleted.
     */
    LaunchDataService.prototype.deleteUpdate = function (update) {
        var index = this._updates.indexOf(update);
        if (index > -1) {
            this._updates.splice(index, 1);
            return true;
        }
        return false;
    };
    Object.defineProperty(LaunchDataService.prototype, "updates", {
        /**
         * Accessor for updates.
         *
         * @returns {Update[]}
         */
        get: function () {
            return this._updates;
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


/***/ },

/***/ 611:
/***/ function(module, exports) {

"use strict";
"use strict";
var Launch = (function () {
    /**
     *
     *
     * @param name
     * @param began_at
     * @param introduction
     * @param webcasts
     * @param resources
     * @param descriptionSections
     */
    function Launch(name, began_at, introduction, webcasts, resources, descriptionSections) {
        this.name = name;
        this.began_at = began_at;
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
        return new Launch(model.name, model.began_at, model.introduction, model.webcasts, model.resources, model.descriptionSections);
    };
    return Launch;
}());
exports.Launch = Launch;


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
var AbstractService_1 = __webpack_require__(313);
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
        this._isLoggedIn = !!localStorage.getItem('authtoken');
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
            return localStorage.getItem('authtoken');
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
            localStorage.setItem('authtoken', authToken); // TODO: Figure out why PHPStorm does not like model.authtoken ("unresolved variable")
            return true;
        })
            .catch(this.handleError);
    };
    /**
     * Log the user out of the application. Remove their localstorage token, and set the
     * application state isLoggedIn property to false.
     */
    AuthService.prototype.logout = function () {
        localStorage.removeItem('authtoken');
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


/***/ }

},[608]);