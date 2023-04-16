import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Race } from "src/app/model/entities/race.model";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { RaceService } from "src/app/services/race.service";
import { UpdateRaceDialogComponent } from "../admin/update-race-dialog/update-race-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";

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
    private localStorageServie: LocalStorageService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) {
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

  openEditRaceDialog(raceId: number): void {
    const dialogRef = this.dialog.open(UpdateRaceDialogComponent, {
      data: { raceId: raceId }
    });
    dialogRef.afterClosed().subscribe((race: Race) => {
      if(race) {
        this.races = this.races.map(r => r.id === race.id? race : r); // replace with updated race
        this.showSnackBar('Race updated!');
      }
    });
  }

  private getRaces(): void {
    if(this.seasonId) {
      this.raceService.getAllRacesForSeason(this.seasonId).subscribe(races => this.races = races);
    }
  }

  private showSnackBar(msg: string): void {
    this.snackBar.open(msg, 'OK', {
      duration: 3000
    });
  }

}
