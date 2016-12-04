import {Component, ElementRef, OnInit, HostListener} from "@angular/core";
import {AuthService} from "../Services/AuthService";
import {AppDataService} from "../Services/AppDataService";
import {Livestream} from "../Interfaces/Livestream";
import {Dimension} from "../Interfaces/Dimension";
import {Position} from "../Interfaces/Position";
import {GuardSharedService} from "../Services/GuardSharedService";
import {UserPreferencesService} from "../Services/UserPreferencesService";

@Component({
    selector:'tmt-livestream',
    template: `      
        <tmt-livestream-player *ngFor="let livestream of userPrefs.visibleLivestreamsAsLivestreams(); let i = index"
        [display]="userPrefs.livestreamPositioningMode"
        [video]="livestream.url | sanitize:'resource'"
        [style.width.px]="calculateLivestreamWidth(livestream, i)" 
        [style.height.px]="calculateLivestreamHeight(livestream, i)"
        [style.left.px]="calculateLivestreamLeftOffset(livestream, i)"
        [style.top.px]="calculateLivestreamTopOffset(livestream, i)"       
        ></tmt-livestream-player>
    `,
    providers: [GuardSharedService]
})
/**
 * @class
 */
export class LivestreamComponent implements OnInit {

    public componentSize: Dimension;
    public nestedLivestreamSize: Dimension;
    public defaultSpacing: Position = {
        x: 40,
        y: 60
    };

    public visibleLivestreams: Livestream[];

    constructor(public elem: ElementRef,
                public authService: AuthService,
                public appData: AppDataService,
                public userPrefs: UserPreferencesService,
                public guardState: GuardSharedService) {}

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
        this.calculateNestedLivestreamDimensions();
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

    /**
     *
     * @param livestream
     * @param index
     *
     * @returns {number}
     */
    public calculateLivestreamWidth(livestream: Livestream, index: number) : number {
        if (this.userPrefs.livestreamPositioningMode === "nested") {
            if (index === 0) {
                return this.componentSize.width;
            }
            return this.nestedLivestreamSize.width;
        }
    }

    /**
     *
     * @param livestream
     * @param index
     *
     * @returns {number}
     */
    public calculateLivestreamHeight(livestream: Livestream, index: number) : number {
        if (this.userPrefs.livestreamPositioningMode === "nested") {
            if (index === 0) {
                return this.componentSize.height;
            }
            return this.nestedLivestreamSize.height;
        }
    }

    /**
     *
     * @param livestream
     * @param index
     *
     * @returns {number}
     */
    public calculateLivestreamLeftOffset(livestream: Livestream, index: number) : number {
        if (this.userPrefs.livestreamPositioningMode === "nested") {
            if (index === 0) {
                return 0;
            }

            return this.defaultSpacing.x * index + this.nestedLivestreamSize.width * (index - 1);
        }
    }

    /**
     *
     *
     * @param livestream
     * @param index
     *
     * @returns {number}
     */
    public calculateLivestreamTopOffset(livestream: Livestream, index: number) : number {
        if (this.userPrefs.livestreamPositioningMode === "nested") {
            if (index === 0) {
                return 0;
            }

            return this.componentSize.height - this.nestedLivestreamSize.height - this.defaultSpacing.y;
        }
    }
}