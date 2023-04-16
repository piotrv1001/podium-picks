import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Race } from "src/app/model/entities/race.model";
import { LocalStorageService } from "src/app/services/local-storage.service";
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
  isAdmin?: number | null;

  constructor(
    private raceService: RaceService,
    private router: Router,
    private localStorageServie: LocalStorageService) {
      this.groupId = this.router.getCurrentNavigation()?.extras?.state?.["groupId"];
      this.seasonId = this.router.getCurrentNavigation()?.extras?.state?.["seasonId"];
    }

  ngOnInit(): void {
    const isAdmin = this.localStorageServie.getIsAdmin();
    this.isAdmin = isAdmin;
    this.getRaces();
  }

  handleRaceClick(raceId: number) {
    if(this.isAdmin && this.isAdmin === 1) {
      this.router.navigate(['results'], { state: { raceId: raceId } });
    } else {
      this.router.navigate(['drivers'], { state: { raceId: raceId, groupId: this.groupId } });
    }
  }

  private getRaces(): void {
    if(this.seasonId) {
      this.raceService.getAllRacesForSeason(this.seasonId).subscribe(races => this.races = races);
    }
  }

}
