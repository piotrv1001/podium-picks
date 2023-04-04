import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Race } from "src/app/model/entities/race.model";

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss']
})
export class RaceComponent {

  @Input() race?: Race;
  @Output() raceClick: EventEmitter<number> = new EventEmitter<number>();

  raceClicked(): void {
    if(this.race?.id) {
      this.raceClick.emit(this.race.id);
    }
  }
}
