import {Component, ElementRef, OnInit, HostListener} from "@angular/core";
import {AuthService} from "../Services/AuthService";
import {AppDataService} from "../Services/AppDataService";
import {Livestream} from "../Interfaces/Livestream";
import {Dimension} from "../Interfaces/Dimension";

@Component({
    selector:'tmt-livestream',
    template: `

        <div class="livestream-guard" [hidden]="!guardEnabled"></div>

        <iframe class="livestream main-livestream" [width]="componentSize.width" [height]="componentSize.height" 
        [src]="getLivestreamByName(appData.livestreamMainIfNested).url | sanitize:'resource'" frameborder="0" allowfullscreen></iframe>
        
        <tmt-nested-livestream-player 
        [video]="getLivestreamByName(appData.livestreamMainIfNested).url | sanitize:'resource'"
        [style.width.px]="nestedLivestreamSize.width" [style.height.px]="nestedLivestreamSize.height"
        (moves)="guardEnabled = true" (movee)="guardEnabled = false"
        ></tmt-nested-livestream-player>
        
        <iframe class="livestream" [width]="" [height]="" [src]="" frameborder="0" allowfullscreen></iframe>
    `
})
/**
 * @class
 */
export class LivestreamComponent implements OnInit {

    public componentSize: Dimension;
    public nestedLivestreamSize: Dimension;

    public guardEnabled : boolean = false;

    constructor(public elem: ElementRef, public authService: AuthService, public appData: AppDataService) {}

    /**
     *
     */
    public ngOnInit() : void {
        this.calculateElementDimensions();
        this.calculateNestedLivestreamDimensions();
    }

    /**
     * Called when a window resize event occurs, recalculate the livestream element dimensions.
     *
     * @param event
     */
    @HostListener('window:resize', ['$event'])
    public onResize(event) : void {
        this.calculateElementDimensions();
    }

    /**
     * Calcutes how large the livestream component should be within the viewport.
     */
    public calculateElementDimensions() : void {
        let viewportWidth = document.documentElement.clientWidth;
        let viewportHeight = document.documentElement.clientHeight;

        // calculate the height of the livestream component based on the 16:9 ratio for the livestream video
        // and the current viewport width
        let allowanceHeight = this.authService.isLoggedIn ? 400 : 200;

        let calculatedHeight = Math.min(
            Math.floor(viewportWidth / (16/9)),
            viewportHeight - allowanceHeight
        );

        this.elem.nativeElement.style.height = calculatedHeight + "px";

        this.componentSize = {
            width: viewportWidth,
            height: calculatedHeight
        };
    }

    /**
     * Nested livestreams should default to being no larger than 1/6th of the full screen size in any dimension
     */
    public calculateNestedLivestreamDimensions() : void {
        this.nestedLivestreamSize = {
            width: null,
            height: null
        };

        let aspectRatio = this.componentSize.width / this.componentSize.height;

        if (aspectRatio > 16/9) {
            this.nestedLivestreamSize.height = this.componentSize.height / 4;
            this.nestedLivestreamSize.width = this.nestedLivestreamSize.height * (16/9);
        } else {
            this.nestedLivestreamSize.width = this.componentSize.width / 4;
            this.nestedLivestreamSize.height = this.nestedLivestreamSize.width / (16/9);
        }
    }

    public getLivestreamByName(name: string) : Livestream {
        return this.appData.livestreams.filter(l => l.name === name)[0];
    }
}