import {Directive, Output, ElementRef, HostListener, EventEmitter} from "@angular/core";

@Directive({
    selector: '[isDroppable]',
    host: {
        '(dragenter)': 'onDragEnter()',
        '(dragleave)': 'onDragLeave()',
        '(dragover)': 'onDragOver()',
        '(drop)': 'onDrop()'
    }
})
export class DroppableDirective {
    @Output() dropped: EventEmitter<any> = new EventEmitter();

    constructor(private el: ElementRef) {}

    @HostListener('dragenter', ['$event'])
    public onDragEnter(event: any) {
        this.el.nativeElement.classList.add("being-dropped")
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave(event: any) {
        this.el.nativeElement.classList.remove("being-dropped");
    }

    @HostListener('dragover', ['$event'])
    public onDragOver(event: any) {
        if (event.preventDefault) {
            event.preventDefault();
        }
    }

    @HostListener('drop', ['$event'])
    public onDrop(event: any) {
        if (event.stopPropagation) {
            event.stopPropagation();
        }

        this.el.nativeElement.classList.remove("being-dropped");

        let data = JSON.parse(event.dataTransfer.getData("text"));
        this.dropped.emit(data);
        return false;
    }
}