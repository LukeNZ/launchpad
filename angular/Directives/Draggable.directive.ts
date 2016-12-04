import {Directive, Input, ElementRef, OnInit, HostListener} from "@angular/core";
@Directive({
    selector: '[isDraggable]',
    host: {
        '(dragstart)': 'onDragStart()',
        '(dragend)': 'onDragEnd()'
    }
})
export class DraggableDirective {
    @Input('isDraggable') data : any;

    constructor(private el : ElementRef) {
        this.el.nativeElement.setAttribute('draggable', 'true');
    }

    @HostListener('dragstart', ['$event'])
    public onDragStart(event: any) {
        this.el.nativeElement.classList.add("being-dragged");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text", JSON.stringify(this.data));
    }

    @HostListener('dragend', ['$event'])
    public onDragEnd(event: any) {
        this.el.nativeElement.classList.remove("being-dragged");
    }
}