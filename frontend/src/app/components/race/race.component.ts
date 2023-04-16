import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Race } from "src/app/model/entities/race.model";

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss']
})
export class RaceComponent {

  @Input() race?: Race;
  @Input() isAdmin: boolean = false;
  @Output() raceClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() editRaceClick: EventEmitter<number> = new EventEmitter<number>();

  raceClicked(): void {
    if(this.race?.id) {
      this.raceClick.emit(this.race.id);
    }
  }

  editRaceClicked(event: Event): void {
    event.stopPropagation();
    if(this.race?.id) {
      this.editRaceClick.emit(this.race.id);
    }
  }
}
