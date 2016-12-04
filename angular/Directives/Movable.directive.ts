import {Directive, ElementRef, HostListener, Input, Output, EventEmitter} from "@angular/core";
import {Position} from "../Interfaces/Position";

@Directive({
    selector: '[movable]',
    host: {
        '(mousedown)': 'onMouseDown()',
        '(window:mousemove)': 'onMouseMove()',
        '(window:mouseup)': 'onMouseUp()'
    }
})
export class MovableDirective {
    @Input('movable') public elemToMove: ElementRef;
    @Output('movestart') public movestart = new EventEmitter<any>();
    @Output('moveend') public moveend = new EventEmitter<any>();

    public canMove : boolean = false;
    public currentElementPosition : Position = { x: 0, y: 0 };
    public currentMousePosition : Position = { x: 0, y: 0 };

    constructor(private elementRef: ElementRef) {}

    /**
     * @param event {any} The event.
     */
    @HostListener('mousedown', ['$event'])
    public onMouseDown(event: any) : boolean {

        let el = this.elemToMove ? this.elemToMove : this.elementRef;

        this.canMove = true;
        this.movestart.next();

        this.currentMousePosition = {
            x: event.pageX,
            y: event.pageY
        };

        this.currentElementPosition = {
            x: this.currentMousePosition.x - el.nativeElement.offsetLeft,
            y: this.currentMousePosition.y - el.nativeElement.offsetTop
        };

        return false;
    }


    /**
     * @param event {any} The event.
     */
    @HostListener('window:mousemove', ['$event'])
    public onMouseMove(event: any) : void {

        let el = this.elemToMove ? this.elemToMove : this.elementRef;

        if (this.canMove) {

            this.currentMousePosition.x = event.pageX;
            this.currentMousePosition.y = event.pageY;

            el.nativeElement.style.left = (this.currentMousePosition.x - this.currentElementPosition.x) + "px";
            el.nativeElement.style.top = (this.currentMousePosition.y - this.currentElementPosition.y) + "px";
        }
    }


    /**
     * @param event {any} The event.
     */
    @HostListener('window:mouseup', ['$event'])
    public onMouseUp(event: any) : void {
        this.canMove = false;
        this.moveend.next();
    }
}