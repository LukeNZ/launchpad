import {Component} from "@angular/core";
import {AuthService} from "../Services/AuthService";

@Component({
    selector:'body',
    template: `
        <router-outlet></router-outlet>
    `
})
export class TMinusTenComponent {
    constructor(public authService: AuthService) {}
}