import {Component, ElementRef, OnInit, HostListener} from "@angular/core";
import {AuthService} from "../Services/AuthService";

@Component({
    selector:'tmt-livestream',
    template: `
    `
})
export class LivestreamComponent implements OnInit {
    constructor(public elem: ElementRef, public authService: AuthService) {
    }

    public ngOnInit() : void {
        this.calculateElementDimensions();
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event) : void {
        this.calculateElementDimensions();
    }

    public calculateElementDimensions() : void {
        let viewportWidth = document.documentElement.clientWidth;
        let viewportHeight = document.documentElement.clientHeight;

        // calculate the height of the livestream component based on the 16:9 ratio for the livestream video
        // and the current viewport width
        let allowanceHeight = this.authService.isLoggedIn ? 400 : 200;

        this.elem.nativeElement.style.height = Math.min(
            Math.floor(viewportWidth / (16/9)),
            viewportHeight - allowanceHeight
        ) + "px";
    }
}