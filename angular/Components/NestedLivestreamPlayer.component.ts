import {Component, Input, HostListener, ElementRef, EventEmitter, Output} from "@angular/core";
import {SafeResourceUrl} from "@angular/platform-browser";

@Component({
    selector: 'tmt-nested-livestream-player',
    template: `
        <div class="control-corner" [hidden]="!isHovering" [movable]="elemRef" (movestart)="enableGuard()" (moveend)="disableGuard()"></div>
        <div class="livestream-guard" [hidden]="!isMoving"></div>
        <iframe class="livestream nested-livestream"  [src]="video" frameborder="0" allowfullscreen></iframe>
    `
})
/**
 * @class
 */
export class NestedLivestreamPlayerComponent {
    @Input() public video: SafeResourceUrl;
    @Output('moves') public movestart = new EventEmitter<any>();
    @Output('movee') public moveend = new EventEmitter<any>();

    public isHovering : boolean = false;
    public isMoving : boolean = false;

    public constructor(public elemRef : ElementRef) {}

    @HostListener('mouseover', ['$event.target'])
    public onMouseOver(elem) : void {
        this.isHovering = true;
    }

    @HostListener('mouseout')
    public onMouseOut() : void {
        this.isHovering = false;
    }

    public enableGuard() : void {
        this.isMoving = true;
        this.movestart.next();
    }

    public disableGuard() : void {
        this.isMoving = false;
        this.moveend.next();
    }
}