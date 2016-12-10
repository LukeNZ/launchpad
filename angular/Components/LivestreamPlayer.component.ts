import {Component, Input, OnInit, HostListener, ElementRef} from "@angular/core";
import {GuardSharedService} from "../Services/GuardSharedService";

@Component({
    selector: 'lp-livestream-player',
    template: `
        <div class="control-corner" [hidden]="!isHovering" [movable]="elemRef" (movestart)="enableGuards()" (moveend)="disableGuards()"></div>
        <div class="livestream-guard" [hidden]="!isGuarded"></div>
        <iframe class="livestream nested-livestream" [src]="video | sanitize:'resource'" frameborder="0" allowfullscreen></iframe>
    `
})
/**
 * @class
 */
export class LivestreamPlayerComponent implements OnInit {
    @Input() public video: string;
    @Input() public display: string;
    public isHovering : boolean = false;
    public isGuarded: boolean = false;

    public constructor(public elemRef : ElementRef,
    public guardState: GuardSharedService) {}

    /**
     * On component initialization, subscribe to the shared guard state service to listen for
     * when a livestream is being moved.
     */
    public ngOnInit() : void {
        this.guardState.guardStateStream().subscribe(value => {
            this.isGuarded = value;
        });
    }

    /**
     *
     * @param elem
     */
    @HostListener('mouseover', ['$event.target'])
    public onMouseOver(elem) : void {
        this.isHovering = true;
    }

    /**
     *
     */
    @HostListener('mouseout')
    public onMouseOut() : void {
        this.isHovering = false;
    }

    /**
     *
     */
    public enableGuards() : void {
        this.guardState.changeGuardState(true);
    }

    /**
     *
     */
    public disableGuards() : void {
        this.guardState.changeGuardState(false);
    }
}