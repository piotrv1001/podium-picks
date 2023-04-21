import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Race } from "src/app/model/entities/race.model";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { RaceService } from "src/app/services/race.service";
import { UpdateRaceDialogComponent } from "../admin/update-race-dialog/update-race-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ScoreService } from "src/app/services/score.service";
import { User } from "src/app/model/entities/user.model";
import { GroupService } from "src/app/services/group.service";

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
  userId2Scores: Map<number, number> = new Map<number, number>();
  dataArray: [number, number][] = [];
  userId2Users: Map<number, User> = new Map<number, User>();

  constructor(
    private raceService: RaceService,
    private scoreService: ScoreService,
    private groupService: GroupService,
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
    if(!this.isAdmin) {
      this.getUsersByGroup();
      this.getGrouppedScores();
    }
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

  private getGrouppedScores(): void {
    if(this.groupId && this.seasonId) {
      this.scoreService.getGrouppedTotalScores(this.groupId, this.seasonId).subscribe(scoreJSON => {
        this.userId2Scores = new Map<number, number>(Object.entries(scoreJSON).map(([key, value]) => [parseInt(key), value]));
        this.dataArray = Array.from(this.userId2Scores);
      })
    }
  }

  private getUsersByGroup(): void {
    if(this.groupId) {
      this.groupService.getUsersByGroup(this.groupId).subscribe({
        next: (users: User[]) => {
          users.forEach(user => {
            if(user.id !== undefined) {
              this.userId2Users.set(user.id, user);
            }
          });
        }
      })
    }
  }

}
