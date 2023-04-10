import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Race } from "src/app/model/entities/race.model";
import { RaceService } from "src/app/services/race.service";

@Component({
  selector: 'app-race-list',
  templateUrl: './race-list.component.html',
  styleUrls: ['./race-list.component.scss']
})
export class RaceListComponent implements OnInit {

  races: Race[] = [];
  groupId?: number;
  seasonId?: number;

  constructor(
    private raceService: RaceService,
    private router: Router) {
      this.groupId = this.router.getCurrentNavigation()?.extras?.state?.["groupId"];
      this.seasonId = this.router.getCurrentNavigation()?.extras?.state?.["seasonId"];
    }

  ngOnInit(): void {
    this.getRaces();
  }

  handleRaceClick(raceId: number) {
    this.router.navigate(['drivers'], { state: { raceId: raceId, groupId: this.groupId } });
  }

  private getRaces(): void {
    if(this.seasonId) {
      this.raceService.getAllRacesForSeason(this.seasonId).subscribe(races => this.races = races);
    }
  }

}
