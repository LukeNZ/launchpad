import {Component} from "@angular/core";
import {AuthService} from "../Services/AuthService";
import {LoginModel} from "../Interfaces/LoginModel";
import {Router} from "@angular/router";

@Component({
    selector: 'tmt-login',
    template: `
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <label for="username">Username</label>
            <input type="text" [(ngModel)]="model.username" name="username" id="username" placeholder="Username" required />
            
            <label for="password">Password</label>
            <input type="text" [(ngModel)]="model.password" name="password" id="password" placeholder="Password" required />
            
            <button type="submit" [hidden]="!loginForm.form.valid">Login</button>
        </form>
    `
})
export class LoginComponent {

    public submitting: boolean = false;
    public loginModel : LoginModel = {
        username: "",
        password: ""
    };

    public constructor(public authService : AuthService, public router: Router) {

    }

    /**
     *
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