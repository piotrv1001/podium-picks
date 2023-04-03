import { Component, OnInit } from "@angular/core";
import { switchMap, take } from "rxjs";
import { Race } from "src/app/model/entities/race.model";
import { RaceService } from "src/app/services/race.service";
import { SeasonService } from "src/app/services/season.service";

@Component({
  selector: 'app-race-list',
  templateUrl: './race-list.component.html',
  styleUrls: ['./race-list.component.scss']
})
export class RaceListComponent implements OnInit {

  races: Race[] = [];

  constructor(
    private seasonService: SeasonService,
    private raceService: RaceService) {}

  ngOnInit(): void {
    this.init();
  }

  private init(): void {
    const seasonIdObs$ = this.seasonService.getCurrentSeasonIdObs();
    seasonIdObs$.pipe(
      take(1),
      switchMap(seasonId => {
        return this.raceService.getAllRacesForSeason(seasonId);
      })
    ).subscribe(races => {
      this.races = races;
    })
  }

}
