import {Component, ElementRef, OnInit, HostListener} from "@angular/core";
import {AuthService} from "../Services/AuthService";
import {AppDataService} from "../Services/AppDataService";
import {Dimension} from "../Interfaces/Dimension";
import {Position} from "../Interfaces/Position";
import {GuardSharedService} from "../Services/GuardSharedService";
import {UserPreferencesService} from "../Services/UserPreferencesService";

@Component({
    selector:'lp-livestream',
    template: `      
        <lp-livestream-player
        [video]="getLivestreamUrl('SpaceX Hosted')"
        [style.order]="getOrder('SpaceX Hosted')"
        [style.width.px]="calculateLivestreamWidth('SpaceX Hosted')" 
        [style.height.px]="calculateLivestreamHeight('SpaceX Hosted')"
        [style.left.px]="calculateLivestreamLeftOffset('SpaceX Hosted')"
        [style.top.px]="calculateLivestreamTopOffset('SpaceX Hosted')"
        [style.z-index]="calculateZIndex('SpaceX Hosted')"
        ></lp-livestream-player>
        
        <!--<lp-livestream-player
        [video]="getLivestreamUrl('SpaceX Technical') | sanitize:'resource'"
        [style.order]="getOrder('SpaceX Technical')"
        [style.width.px]="calculateLivestreamWidth('SpaceX Technical')" 
        [style.height.px]="calculateLivestreamHeight('SpaceX Technical')"
        [style.left.px]="calculateLivestreamLeftOffset('SpaceX Technical')"
        [style.top.px]="calculateLivestreamTopOffset('SpaceX Technical')"
        [style.z-index]="calculateZIndex('SpaceX Technical')"
        ></lp-livestream-player>
        
        <lp-livestream-player
        [video]="getLivestreamUrl('NASA') | sanitize:'resource'"
        [style.order]="getOrder('NASA')"
        [style.width.px]="calculateLivestreamWidth('NASA')" 
        [style.height.px]="calculateLivestreamHeight('NASA')"
        [style.left.px]="calculateLivestreamLeftOffset('NASA')"
        [style.top.px]="calculateLivestreamTopOffset('NASA')"
        [style.z-index]="calculateZIndex('NASA')"
        ></lp-livestream-player>-->
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

        let temp = this.userPrefs.visibleLivestreams;
    }

    /**
     * Calcutes how large the livestream component should be within the viewport.
     */
    public calculateElementDimensions() : void {
        let viewportWidth = document.documentElement.clientWidth;
        let viewportHeight = document.documentElement.clientHeight;

        // calculate the height of the livestream component based on the 16:9 ratio for the livestream video
        // and the current viewport width
        let allowanceHeight = this.authService.isLoggedIn ? 400 : 150;

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
     *
     * @returns {number}
     */
    public calculateLivestreamWidth(livestream: string) : number {
        let index = this.getOrder(livestream);

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
     *
     * @returns {number}
     */
    public calculateLivestreamHeight(livestream: string) : number {
        let index = this.getOrder(livestream);

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
     *
     * @returns {number}
     */
    public calculateLivestreamLeftOffset(livestream: string) : number {
        let index = this.getOrder(livestream);

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
     *
     * @returns {number}
     */
    public calculateLivestreamTopOffset(livestream: string) : number {
        let index = this.getOrder(livestream);

        if (this.userPrefs.livestreamPositioningMode === "nested") {
            if (index === 0) {
                return 0;
            }

            return this.componentSize.height - this.nestedLivestreamSize.height - this.defaultSpacing.y;
        }
    }

    public getLivestreamUrl(name: string) : string {
        return this.appData.livestreams.filter(l => l.name === name)[0].url;
    }

    public getOrder(name: string) : number {
        return this.userPrefs.visibleLivestreams.indexOf(name);
    }

    public calculateZIndex(name: string) : number {
        let index = this.getOrder(name);

        if (index === 0) {
            return 1;
        }
        return 3;
    }
}