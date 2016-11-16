webpackJsonp([0],{

/***/ 100:
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
var http_1 = __webpack_require__(51);
var AbstractService_1 = __webpack_require__(268);
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


/***/ },

/***/ 163:
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
var Observable_1 = __webpack_require__(3);
var io = __webpack_require__(179);
var WebsocketService = (function () {
    function WebsocketService() {
        this.socket = null;
        this.socket = io.connect("localhost:3001");
    }
    /**
     *
     * @param typingStatus
     */
    WebsocketService.prototype.emitTypingStatus = function (typingStatus) {
        this.socket.emit("typingStatus", typingStatus);
    };
    /**
     *
     * @param launchUpdate
     */
    WebsocketService.prototype.emitCreateLaunchUpdate = function (launchUpdate) {
        this.socket.emit("launchUpdate", launchUpdate);
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
        this.socket.emit("launchStatus", launchStatus);
    };
    /**
     *
     * @param statusType
     * @param data
     */
    WebsocketService.prototype.emitAppStatus = function (statusType, data) {
        if (!data) {
            data = {};
        }
        console.log('called');
        this.socket.emit("appStatus", {
            user: "foo",
            key: "bar",
            statusType: statusType,
            data: data
        });
    };
    /**
     *
     * @returns {Observable}
     */
    WebsocketService.prototype.launchUpdatesStream = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.on('launchUpdate', function (data) { return observer.next(data); });
            return function () { return _this.socket.disconnect(); };
        });
    };
    /**
     *
     * @returns {Observable}
     */
    WebsocketService.prototype.launchStatusesStream = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.on('launchStatus', function (data) { return observer.next(data); });
            return function () { return _this.socket.disconnect(); };
        });
    };
    WebsocketService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], WebsocketService);
    return WebsocketService;
}());
exports.WebsocketService = WebsocketService;


/***/ },

/***/ 266:
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
var InitializationService_1 = __webpack_require__(269);
var WebsocketService_1 = __webpack_require__(163);
var AuthService_1 = __webpack_require__(100);
var Observable_1 = __webpack_require__(3);
__webpack_require__(178);
var HomeComponent = (function () {
    function HomeComponent(initializationService, authService, websocketService, titleService) {
        this.initializationService = initializationService;
        this.authService = authService;
        this.websocketService = websocketService;
        this.titleService = titleService;
        this.isLoading = true;
        this.isActive = false;
        this.titleService.setTitle("T Minus Ten");
    }
    /**
     * On component initialization, make three calls to fetch data from the server.
     */
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        Observable_1.Observable.forkJoin(this.initializationService.getStatus(), this.initializationService.getUpdates(), this.initializationService.getWebcasts()).subscribe(function (data) {
            _this.isActive = data[0].isActive;
            _this.isLoading = false;
        });
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'tmt-home',
            template: "\n        <p *ngIf=\"isLoading\">Loading...</p>\n        \n        <!-- Only show the below contents if the application has loaded. -->\n        <template [ngIf]=\"!isLoading\">\n        \n            <!-- Only show if the application is not active. -->\n            <template [ngIf]=\"!isActive\">\n            \n                <!-- Allow a logged in user to access the application settings to start a launch. -->\n                <template [ngIf]=\"authService.isLoggedIn\">\n                    <tmt-settings></tmt-settings>\n                </template>\n                \n                <!-- If the application is not active, and the user is a visitor, \n                show the default message. -->\n                <template [ngIf]=\"!authService.isLoggedIn\">\n                    <p>There is no active launch at this time. Check back soon!</p>\n                </template>\n            </template>\n            \n            <!-- Show if the application is active. -->\n            <template [ngIf]=\"isActive\">\n                <tmt-header></tmt-header>\n                <tmt-webcast></tmt-webcast>\n                <tmt-statusbar></tmt-statusbar>\n                <tmt-updates></tmt-updates>\n            </template>  \n             \n        </template>     \n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof InitializationService_1.InitializationService !== 'undefined' && InitializationService_1.InitializationService) === 'function' && _a) || Object, (typeof (_b = typeof AuthService_1.AuthService !== 'undefined' && AuthService_1.AuthService) === 'function' && _b) || Object, (typeof (_c = typeof WebsocketService_1.WebsocketService !== 'undefined' && WebsocketService_1.WebsocketService) === 'function' && _c) || Object, (typeof (_d = typeof platform_browser_1.Title !== 'undefined' && platform_browser_1.Title) === 'function' && _d) || Object])
    ], HomeComponent);
    return HomeComponent;
    var _a, _b, _c, _d;
}());
exports.HomeComponent = HomeComponent;


/***/ },

/***/ 267:
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
var AuthService_1 = __webpack_require__(100);
var router_1 = __webpack_require__(105);
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

/***/ 268:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var http_1 = __webpack_require__(51);
var Observable_1 = __webpack_require__(3);
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

/***/ 269:
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
var http_1 = __webpack_require__(51);
var AbstractService_1 = __webpack_require__(268);
var InitializationService = (function (_super) {
    __extends(InitializationService, _super);
    function InitializationService(http) {
        _super.call(this);
        this.http = http;
    }
    /**
     *
     */
    InitializationService.prototype.getUpdates = function () {
        var _this = this;
        return this.http.get('/api/updates', this.headers()).map(function (res) { return _this.extractData(res); });
    };
    /**
     *
     */
    InitializationService.prototype.getStatus = function () {
        return this.http.get('/api/status', this.headers());
    };
    /**
     *
     * @returns {Observable<Response>}
     */
    InitializationService.prototype.getWebcasts = function () {
        return this.http.get('/api/webcasts', this.headers());
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

/***/ 293:
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
var http_1 = __webpack_require__(51);
var TMinusTen_component_1 = __webpack_require__(409);
var Header_component_1 = __webpack_require__(405);
var Countdown_component_1 = __webpack_require__(404);
var StatusBar_component_1 = __webpack_require__(408);
var Updates_component_1 = __webpack_require__(410);
var Webcast_component_1 = __webpack_require__(411);
var app_routes_1 = __webpack_require__(413);
var Home_component_1 = __webpack_require__(266);
var InitializationService_1 = __webpack_require__(269);
var WebsocketService_1 = __webpack_require__(163);
var Login_component_1 = __webpack_require__(267);
var NotificationBanner_component_1 = __webpack_require__(406);
var forms_1 = __webpack_require__(177);
var AuthService_1 = __webpack_require__(100);
var TMinusTenService_1 = __webpack_require__(412);
var Settings_component_1 = __webpack_require__(407);
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, http_1.HttpModule, forms_1.FormsModule, app_routes_1.routing],
            providers: [InitializationService_1.InitializationService, WebsocketService_1.WebsocketService, AuthService_1.AuthService, TMinusTenService_1.TMinusTenService],
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

/***/ 404:
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

/***/ 405:
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

/***/ 406:
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
var NotificationBannerComponent = (function () {
    function NotificationBannerComponent() {
    }
    NotificationBannerComponent = __decorate([
        core_1.Component({
            selector: 'tmt-notification-banner',
            template: "\n    <div class=\"notification-banner\">\n        <p>{{ notification }}</p>\n    </div>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], NotificationBannerComponent);
    return NotificationBannerComponent;
}());
exports.NotificationBannerComponent = NotificationBannerComponent;


/***/ },

/***/ 407:
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
var WebsocketService_1 = __webpack_require__(163);
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
    function SettingsComponent(websocketService) {
        this.websocketService = websocketService;
        this.settingsSection = SettingsSection;
        this.currentSection = this.settingsSection.General;
        this.model = {
            missionName: ""
        };
        this.settingsState = {
            isLaunching: false,
            isSaving: false
        };
    }
    /**
     *
     */
    SettingsComponent.prototype.launch = function () {
        this.settingsState.isLaunching = true;
        this.websocketService.emitAppStatus("foo", { missionName: this.model.missionName });
    };
    SettingsComponent = __decorate([
        core_1.Component({
            selector: 'tmt-settings',
            template: "\n        <div>\n            <nav>\n                <ul>\n                    <li (click)=\"currentSection = settingsSection.General\">General</li>\n                    <li (click)=\"currentSection = settingsSection.Countdown\">Countdown</li>\n                    <li (click)=\"currentSection = settingsSection.Introduction\">Introduction</li>\n                    <li (click)=\"currentSection = settingsSection.DescriptionSections\">Description Sections</li>\n                    <li (click)=\"currentSection = settingsSection.Resources\">Resources</li>\n                    <li (click)=\"currentSection = settingsSection.LaunchStatuses\">Launch Statuses</li>\n                    <li (click)=\"currentSection = settingsSection.About\">About the App</li>\n                </ul>\n            </nav>\n            \n            <section [hidden]=\"currentSection != settingsSection.General\">\n                <h1>General</h1>\n                \n                <form>\n                    <label for=\"missionName\">Mission Name</label>\n                    <input type=\"text\" name=\"missionName\" [(ngModel)]=\"model.missionName\" placeholder=\"Mission Name\">\n                </form>\n            </section>\n            \n            <section [hidden]=\"currentSection != settingsSection.Countdown\">\n                <h1>Countdown</h1>\n            </section>\n            \n            <section [hidden]=\"currentSection != settingsSection.Introduction\">\n                <h1>Introduction</h1>\n            </section>\n            \n            <section [hidden]=\"currentSection != settingsSection.DescriptionSections\">\n                <h1>Description Sections</h1>\n            </section>\n            \n            <section [hidden]=\"currentSection != settingsSection.Resources\">\n                <h1>Resources</h1>\n            </section>\n            \n            <section [hidden]=\"currentSection != settingsSection.LaunchStatuses\">\n                <h1>Launch Statuses</h1>\n            </section>\n            \n            <section [hidden]=\"currentSection != settingsSection.About\">\n                <h1>About the App</h1>\n            </section>\n            \n            <div>\n                <button (click)=\"launch()\" [disabled]=\"settingsState.isLaunching\">\n                    {{ settingsState.isLaunching ? \"Launching...\" : \"Launch\" }}\n                </button>\n            </div>\n        </div>\n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof WebsocketService_1.WebsocketService !== 'undefined' && WebsocketService_1.WebsocketService) === 'function' && _a) || Object])
    ], SettingsComponent);
    return SettingsComponent;
    var _a;
}());
exports.SettingsComponent = SettingsComponent;


/***/ },

/***/ 408:
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
var core_1 = __webpack_require__(0);
var AuthService_1 = __webpack_require__(100);
var TMinusTenComponent = (function () {
    function TMinusTenComponent(authService) {
        this.authService = authService;
    }
    TMinusTenComponent = __decorate([
        core_1.Component({
            selector: 'body',
            template: "\n        <tmt-notification-banner></tmt-notification-banner>\n        <router-outlet></router-outlet>\n    "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof AuthService_1.AuthService !== 'undefined' && AuthService_1.AuthService) === 'function' && _a) || Object])
    ], TMinusTenComponent);
    return TMinusTenComponent;
    var _a;
}());
exports.TMinusTenComponent = TMinusTenComponent;


/***/ },

/***/ 410:
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

/***/ 411:
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

/***/ 412:
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
var TMinusTenService = (function () {
    function TMinusTenService() {
    }
    TMinusTenService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], TMinusTenService);
    return TMinusTenService;
}());
exports.TMinusTenService = TMinusTenService;


/***/ },

/***/ 413:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var router_1 = __webpack_require__(105);
var Home_component_1 = __webpack_require__(266);
var Login_component_1 = __webpack_require__(267);
var appRoutes = [
    { path: '', component: Home_component_1.HomeComponent },
    { path: 'login', component: Login_component_1.LoginComponent }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
exports.routedComponents = [Home_component_1.HomeComponent];


/***/ },

/***/ 469:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var platform_browser_dynamic_1 = __webpack_require__(106);
var app_module_1 = __webpack_require__(293);
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule)
    .then(function (success) { return console.log("Bootstrap success"); })
    .catch(function (error) { return console.log(error); });


/***/ }

},[469]);