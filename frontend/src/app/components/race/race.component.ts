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
  @Input() isNextRace?: boolean = false;
  @Output() raceClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() editRaceClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() resultsBtnClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() pointsBtnClick: EventEmitter<number> = new EventEmitter<number>();

  raceClicked(): void {
    if(this.race?.id != null) {
      this.raceClick.emit(this.race.id);
    }
  }

  resultsBtnClicked(event: Event): void {
    event.stopPropagation();
    if(this.race?.id != null) {
      this.resultsBtnClick.emit(this.race.id);
    }
  }

  pointsBtnClicked(event: Event): void {
    event.stopPropagation();
    if(this.race?.id != null) {
      this.pointsBtnClick.emit(this.race.id);
    }
  }

  editRaceClicked(event: Event): void {
    event.stopPropagation();
    if(this.race?.id != null) {
      this.editRaceClick.emit(this.race.id);
    }
  }
}
