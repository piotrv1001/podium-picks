import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Driver } from "src/app/model/entities/driver.model";
import { Prediction } from "src/app/model/entities/prediction.model";
import { Score } from "src/app/model/entities/score.model";
import { PredictionOutput, PredictionService } from "src/app/services/prediction.service";
import { ScoreService } from "src/app/services/score.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RaceEventService } from "src/app/services/race-event.service";
import { TranslateService } from "@ngx-translate/core";
import { DriverService } from "src/app/services/driver.service";
import { DragDropEvent } from "src/app/model/types/drag-drop-event";
import { MatTabGroup } from "@angular/material/tabs";
import { ERROR_MSG } from "src/app/app.constants";
import { PredictionDTO } from "src/app/model/dto/prediction.dto";

@Component({
  selector: 'app-admin-points',
  templateUrl: './admin-points.component.html',
  styleUrls: ['./admin-points.component.scss'],
})
export class AdminPointsComponent implements OnInit {

  @ViewChild('tabGroup') tabGroup?: MatTabGroup;
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
    public translateService: TranslateService,
    private driverService: DriverService
  ) {
    const navState = this.router.getCurrentNavigation()?.extras?.state
    this.raceId = navState?.["raceId"];
    this.userId = navState?.["userId"];
    this.groupId = navState?.["groupId"];
  }

  ngOnInit(): void {
    this.getMadeChanges();
    this.getDrivers();
    this.getScores();
    this.getPredictions();
  }

  handlePredictionSaveBtnClick(): void {
    let drivers = this.raceEventService.getDrivers();
    if(drivers.length === 0) {
      drivers = this.drivers;
    }
    this.setTabAnimationDuration(0);
    if(this.userId !== undefined) {
      const isUpdate = this.predictions.length !== 0;
      if(isUpdate) {
        this.updatePredictions();
      } else {
        this.createPredictions(drivers);
      }
    } else {
      const msg = this.translateService.instant('error.userNotFound');
      this.showSnackBar(msg);
    }
  }

  handleScoreUpdate(score: Score): void {
    this.updatedScores.push(score);
  }

  handleSavePointsBtnClick(): void {
    this.updateScores();
  }

  handleDriverDragDrop(dragDropEvent: DragDropEvent): void {
    if(this.userId) {
      const predictions = this.predictions;
      if(predictions && predictions.length > 0) {
        const lower = Math.min(dragDropEvent.previousIndex, dragDropEvent.currentIndex);
        const upper = Math.max(dragDropEvent.previousIndex, dragDropEvent.currentIndex);
        for(let i = lower; i <= upper; i++) {
          const driverIndex = predictions.findIndex(prediction => prediction.driverId === dragDropEvent.drivers[i].id);
          if(driverIndex !== -1) {
            predictions[driverIndex].predictedPosition = i + 1;
          }
        }
      }
    }
  }

  private updatePredictions(): void {
    if(this.userId !== undefined) {
      const predictions = this.predictions
      if(predictions) {
        this.predictionService.updateMany(predictions).subscribe({
          next: (updatedPredictions) => {
            if(this.isArrayOfPredictions(updatedPredictions)) {
              this.predictions = updatedPredictions;
            } else {
              this.predictions = updatedPredictions.predictions;
              this.scores = updatedPredictions.scores;
            }
            const msg = this.translateService.instant('race.predictions.updated');
            this.showSnackBar(msg);
            this.notifyAboutMadeChanges(false);
            setTimeout(() => {
              this.setTabAnimationDuration(400);
            }, 0);
          },
          error: () => {
            this.showSnackBar(ERROR_MSG);
          }
        });
      }
    }
  }

  private createPredictions(drivers: Driver[]): void {
    const newPredictionArray: PredictionDTO[] = [];
    drivers.forEach((driver: Driver, index: number) => {
      if(driver.id && this.raceId && this.userId && this.groupId) {
        const newPrediction = new PredictionDTO(
          index + 1,
          driver.id,
          this.raceId,
          this.userId,
          this.groupId
        );
        newPredictionArray.push(newPrediction);
      } else {
        this.showSnackBar(ERROR_MSG);
        return;
      }
    });
    if(this.userId !== undefined) {
      this.predictionService.createMany(newPredictionArray).subscribe({
        next: (newPredictions: PredictionOutput) => {
          if(this.isArrayOfPredictions(newPredictions)) {
            this.predictions = newPredictions;
          } else {
            this.predictions = newPredictions.predictions;
            this.scores = newPredictions.scores;
          }
          const msg = this.translateService.instant('race.predictions.created');
          this.showSnackBar(msg);
          this.notifyAboutMadeChanges(false);
          setTimeout(() => {
            this.setTabAnimationDuration(400);
          }, 0);
        },
        error: () => {
          this.showSnackBar(ERROR_MSG);
        }
      });
    }
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

  private getDrivers(): void {
    this.driverService.getAllDrivers().subscribe(drivers => {
      if(this.drivers.length === 0) {
        this.drivers = drivers;
      }
    });
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

  private notifyAboutMadeChanges(madeChanges: boolean): void {
    this.raceEventService.notifyAboutMadeChanges(madeChanges);
  }

  private setTabAnimationDuration(ms: 0 | 400): void {
    if(this.tabGroup) {
      this.tabGroup.animationDuration = `${ms}ms`;
    }
  }

  private isArrayOfPredictions(output: PredictionOutput): output is Prediction[] {
    return Array.isArray(output);
  }

  private showSnackBar(msg: string): void {
    this.snackBar.open(msg, 'OK', {
      duration: 3000
    });
  }

}
