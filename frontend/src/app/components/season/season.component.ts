import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Season } from "src/app/model/entities/season.model";

@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.scss']
})
export class SeasonComponent {

  @Input() season?: Season;
  @Output() seasonClick: EventEmitter<Season> = new EventEmitter<Season>();

  seasonClicked(): void {
    this.seasonClick.emit(this.season);
  }

}
