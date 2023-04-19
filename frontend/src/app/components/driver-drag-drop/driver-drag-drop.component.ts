import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core";
import { Driver } from "src/app/model/entities/driver.model";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropEvent } from "src/app/model/types/drag-drop-event";
import { RaceEventService } from "src/app/services/race-event.service";
import { Score } from "src/app/model/entities/score.model";

@Component({
  selector: 'app-driver-drag-drop',
  templateUrl: './driver-drag-drop.component.html',
  styleUrls: ['./driver-drag-drop.component.scss']
})
export class DriverDragDropComponent implements OnInit {

  @Input() drivers: Driver[] = [];
  @Input() isEditable: boolean = false;
  @Input() scoreArray?: Score[] = [];
  @Output() dropped: EventEmitter<DragDropEvent> = new EventEmitter();
  @Output() saved: EventEmitter<Driver[]> = new EventEmitter();
  madeChanges: boolean = false;
  pointArray: number[] = [];
  lastMovedItemIndex: number = -1;

  constructor(private raceEventService: RaceEventService) { }

  ngOnInit(): void {
    if(this.scoreArray && this.scoreArray.length > 0) {
      this.pointArray = this.scoreArray.map(s => s.points ?? 0);
    }
    this.subscribeToMadeChanges();
  }

  drop(event: CdkDragDrop<Driver[]>) {
    const prevIndex = event.previousIndex;
    const currIndex = event.currentIndex;
    if(prevIndex !== currIndex) {
      this.madeChanges = true;
      moveItemInArray(this.drivers, prevIndex, currIndex);
      this.dropped.emit({ previousIndex: prevIndex, currentIndex: currIndex, drivers: this.drivers });
    }
    this.lastMovedItemIndex = currIndex;
  }

  saveBtnClicked(): void {
    this.saved.emit(this.drivers);
  }

  private subscribeToMadeChanges(): void {
    this.raceEventService.getMadeChangesObservable().subscribe(madeChanges => this.madeChanges = madeChanges);
  }

}
