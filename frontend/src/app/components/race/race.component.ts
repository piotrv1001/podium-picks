import { Component, Input } from "@angular/core";
import { Race } from "src/app/model/entities/race.model";

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss']
})
export class RaceComponent {

  @Input() race?: Race;

}
