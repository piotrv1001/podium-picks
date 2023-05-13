import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Driver } from "src/app/model/entities/driver.model";
import { Prediction } from "src/app/model/entities/prediction.model";
import { Score } from "src/app/model/entities/score.model";
import { PredictionService } from "src/app/services/prediction.service";
import { ScoreService } from "src/app/services/score.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RaceEventService } from "src/app/services/race-event.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-admin-points',
  templateUrl: './admin-points.component.html',
  styleUrls: ['./admin-points.component.scss'],
})
export class AdminPointsComponent implements OnInit {

  raceId?: number;
  userId?: number;
  groupId?: number;
  scores: Score[] = [];
  predictions: Prediction[] = [];
  drivers: Driver[] = [];
  updatedScores: Score[] = [];
  madeChanges: boolean = false;

  constructor(
    private router: Router,
    private scoreService: ScoreService,
    private predictionService: PredictionService,
    private snackBar: MatSnackBar,
    private raceEventService: RaceEventService,
    public translateService: TranslateService
  ) {
    const navState = this.router.getCurrentNavigation()?.extras?.state
    this.raceId = navState?.["raceId"];
    this.userId = navState?.["userId"];
    this.groupId = navState?.["groupId"];
  }

  ngOnInit(): void {
    this.getMadeChanges();
    this.getScores();
    this.getPredictions();
  }

  handleScoreUpdate(score: Score): void {
    this.updatedScores.push(score);
  }

  handleSavePointsBtnClick(): void {
    this.updateScores();
  }

  private getMadeChanges(): void {
    this.raceEventService.getMadeChangesObservable().subscribe(madeChanges => {
      this.madeChanges = madeChanges;
    });
  }

  private getScores(): void {
    if(this.userId != null && this.groupId != null && this.raceId != null) {
      this.scoreService.getByUserGroupRace(this.userId, this.groupId, this.raceId).subscribe(scores => {
        this.scores = scores;
      });
    }
  }

  private getPredictions(): void {
    if(this.userId != null && this.groupId != null && this.raceId != null) {
      this.predictionService.getByUserAndRaceAndGroup(this.userId, this.raceId, this.groupId).subscribe(predictions => {
        this.predictions = predictions;
        if(predictions.length > 0) {
          this.drivers = predictions.map(prediction => prediction.driver!);
        }
      });
    }
  }

  private updateScores(): void {
    this.scoreService.updateMany(this.updatedScores).subscribe({
      next: () => {
        const msg = this.translateService.instant('race.points.updated');
        this.showSnackBar(msg);
        this.raceEventService.notifyAboutMadeChanges(false);
      },
      error: (error: Error) => {
        this.showSnackBar(error.message);
      }
    })
  }

  private showSnackBar(msg: string): void {
    this.snackBar.open(msg, 'OK', {
      duration: 3000
    });
  }

}
