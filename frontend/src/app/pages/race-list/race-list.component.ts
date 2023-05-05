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
import { Stats } from "src/app/model/types/stats";

@Component({
  selector: 'app-race-list',
  templateUrl: './race-list.component.html',
  styleUrls: ['./race-list.component.scss']
})
export class RaceListComponent implements OnInit {

  races: Race[] = [];
  filteredRaces: Race[] = [];
  groupId?: number;
  seasonId?: number;
  isAdmin?: number | null;
  userId2Stats: Map<number, Stats> = new Map<number, Stats>();
  dataArray: [number, Stats][] = [];
  userId2Users: Map<number, User> = new Map<number, User>();
  nextRace?: Race;
  query: string = '';
  showNextRaceOnly: boolean = false;

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

  onSearchQueryChange(query: string): void {
    if(query.length > 2) {
      this.filteredRaces = this.races.filter(
        race => race.country?.toLowerCase()?.includes(query.toLowerCase()) ||
        race.name?.toLowerCase()?.includes(query.toLowerCase()));
    } else {
      this.resetRaces();
    }
  }

  resetSearch(): void {
    this.query = '';
    this.resetRaces();
  }

  nextRaceOnly(): void {
    if(this.showNextRaceOnly) {
      this.filteredRaces = this.races.filter(race => race === this.nextRace);
    } else {
      this.onSearchQueryChange(this.query);
    }
  }

  handleRaceClick(raceId: number) {
    if(this.isAdmin == null || this.isAdmin !== 1) {
      this.router.navigate(['drivers'], { state: { raceId: raceId, groupId: this.groupId } });
    }
  }

  handleResultsBtnClick(raceId: number): void {
    if(this.isAdmin && this.isAdmin === 1) {
      this.router.navigate(['results'], { state: { raceId: raceId } });
    }
  }

  handlePointsBtnClick(raceId: number): void {
    if(this.isAdmin && this.isAdmin === 1) {
      this.router.navigate(['groups'], { state: { raceId: raceId } });
    }
  }

  openEditRaceDialog(raceId: number): void {
    const dialogRef = this.dialog.open(UpdateRaceDialogComponent, {
      data: { raceId: raceId }
    });
    dialogRef.afterClosed().subscribe((race: Race) => {
      if(race) {
        this.races = this.races.map(r => r.id === race.id? race : r); // replace with updated race
        if(this.nextRace?.id === race.id) {
          this.nextRace = race;
        }
        this.showSnackBar('Race updated!');
      }
    });
  }

  private getRaces(): void {
    if(this.seasonId) {
      this.raceService.getAllRacesForSeason(this.seasonId).subscribe(races => {
        this.races = races;
        this.filteredRaces = [...this.races];
        this.nextRace = this.getNextRaceByDate(this.races);
      });
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
        this.userId2Stats = new Map<number, Stats>(Object.entries(scoreJSON).map(([key, value]) => [parseInt(key), value]));
        this.dataArray = Array.from(this.userId2Stats).sort((a, b) => b[1].total - a[1].total);
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

  private getNextRaceByDate(races: Race[]): Race | undefined {
    const now = new Date();
    let closestRace: Race | undefined;
    let closestDiff = Infinity;

    for (const race of races) {
      let raceDate = race?.date;
      if(raceDate) {
        if(typeof raceDate === 'string') {
          raceDate = new Date(raceDate);
        }
        const diff = raceDate.getTime() - now.getTime();
        if (diff > 0 && diff < closestDiff) {
          closestDiff = diff;
          closestRace = race;
        }
      }
    }

    return closestRace;
  }

  private resetRaces(): void {
    this.filteredRaces = [...this.races];
  }

}
