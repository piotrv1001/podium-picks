import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Driver } from "src/app/model/entities/driver.model";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropEvent } from "src/app/model/types/drag-drop-event";

@Component({
  selector: 'app-driver-drag-drop',
  templateUrl: './driver-drag-drop.component.html',
  styleUrls: ['./driver-drag-drop.component.scss']
})
export class DriverDragDropComponent {

  @Input() drivers: Driver[] = [];
  @Input() isEditable: boolean = false;
  @Output() dropped: EventEmitter<DragDropEvent> = new EventEmitter();
  @Output() saved: EventEmitter<Driver[]> = new EventEmitter();
  @Input() madeChanges: boolean = false;

  drop(event: CdkDragDrop<Driver[]>) {
    const prevIndex = event.previousIndex;
    const currIndex = event.currentIndex;
    if(prevIndex !== currIndex) {
      this.madeChanges = true;
      moveItemInArray(this.drivers, prevIndex, currIndex);
      this.dropped.emit({ previousIndex: prevIndex, currentIndex: currIndex, drivers: this.drivers });
    }
  }

  saveBtnClicked(): void {
    this.saved.emit(this.drivers);
  }

}
