import {Component} from "@angular/core";
import {AuthService} from "../Services/AuthService";
import {LoginModel} from "../Interfaces/LoginModel";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'lp-login',
    template: `
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <label for="username">Username</label>
            <input type="text" [(ngModel)]="loginModel.username" name="username" id="username" placeholder="Username" required /><br/>
            
            <label for="password">Password</label>
            <input type="text" [(ngModel)]="loginModel.password" name="password" id="password" placeholder="Password" required /><br/>
            
            <button type="submit" [hidden]="!loginForm.form.valid" [disabled]="submitting">{{ submitting ? "Logging in..." : "Login" }}</button>
        </form>
    `
})
/**
 * Component accessible from the '/login' route. Contains all functionality needed to authenticate with the T Minus Ten
 * app.
 */
export class LoginComponent {

    public submitting: boolean = false;
    public loginModel : LoginModel = {
        username: "",
        password: ""
    };

    public constructor(public authService : AuthService,
                       public router: Router,
                       public titleService: Title) {
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
    public onSubmit() : void {
        this.submitting = true;
        this.authService.login(this.loginModel).subscribe(success => {
            this.router.navigate(["/"]);
        }, error => {
            this.submitting = false;
        });
    }
}