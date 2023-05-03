import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SeasonWithProgress } from "src/app/model/types/season-with-progress";

@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.scss']
})
export class SeasonComponent {

  @Input() season?: SeasonWithProgress;
  @Output() seasonClick: EventEmitter<SeasonWithProgress> = new EventEmitter<SeasonWithProgress>();

  seasonClicked(): void {
    this.seasonClick.emit(this.season);
  }

}
