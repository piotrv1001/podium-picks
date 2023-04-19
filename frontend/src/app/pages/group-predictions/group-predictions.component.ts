import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Driver } from 'src/app/model/entities/driver.model';
import { Prediction } from 'src/app/model/entities/prediction.model';
import { Race } from 'src/app/model/entities/race.model';
import { CustomDate } from 'src/app/model/types/custom-date';
import { DriverService } from 'src/app/services/driver.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PredictionService } from 'src/app/services/prediction.service';
import { RaceService } from 'src/app/services/race.service';
import { DateUtilService } from 'src/app/shared/util/date-util.service';
import { firstValueFrom } from 'rxjs';
import { ConfirmedDrivers } from 'src/app/model/types/confirmed-drivers';
import { DragDropEvent } from 'src/app/model/types/drag-drop-event';
import { ERROR_MSG } from 'src/app/app.constants';
import { PredictionDTO } from 'src/app/model/dto/prediction.dto';
import { RaceEventService } from 'src/app/services/race-event.service';
import { ScoreService } from 'src/app/services/score.service';
import { Score } from 'src/app/model/entities/score.model';

@Component({
  selector: 'app-group-predictions',
  templateUrl: './group-predictions.component.html',
  styleUrls: ['./group-predictions.component.scss']
})
export class GroupPredictionsComponent implements OnInit, OnDestroy {

  drivers: Driver[] = [];
  driverObj: { [id: number]: Driver } = {};
  raceId?: number;
  userId?: number;
  groupId?: number;
  userId2Predictions: Map<number, Prediction[]> = new Map<number, Prediction[]>();
  userId2Drivers: Map<number, ConfirmedDrivers> = new Map<number, ConfirmedDrivers>();
  userId2Scores: Map<number, Score[]> = new Map<number, Score[]>();
  dataArray: [number, ConfirmedDrivers][] = [];
  race?: Race;
  timeLeft?: CustomDate;
  raceFinished: boolean = false;
  madeChanges: boolean = false;
  raceIntervalId?: any;
  scoreAvailable: boolean = false;

  constructor(
    private driverService: DriverService,
    private raceService: RaceService,
    private predictionService: PredictionService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dateUtilService: DateUtilService,
    private raceEventService: RaceEventService,
    private scoreService: ScoreService) {
      const navState = this.router.getCurrentNavigation()?.extras?.state
      this.raceId = navState?.["raceId"];
      this.groupId = navState?.["groupId"];
    }

    ngOnInit(): void {
      this.getUserId();
      this.getRace();
      this.getUserId2Predictions();
      this.getScores();
    }

    ngOnDestroy(): void {
      clearInterval(this.raceIntervalId);
    }

    handlePredictionSaveBtnClick(drivers: Driver[]): void {
      if(this.userId) {
        const isUpdate = this.userId2Predictions.get(this.userId)?.length !== 0;
        if(isUpdate) {
          this.updatePredictions();
        } else {
          this.createPredictions(drivers);
        }
      } else {
        this.showSnackBar('Error: User not found! Try again later.');
      }
    }

    handleDriverDragDrop(dragDropEvent: DragDropEvent): void {
      if(this.userId) {
        const predictions = this.userId2Predictions.get(this.userId);
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
      if(this.userId) {
        let predictions = this.userId2Predictions.get(this.userId);
        if(predictions) {
          this.predictionService.updateMany(predictions).subscribe({
            next: (updatedPredictions) => {
              this.userId2Predictions.set(this.userId!, updatedPredictions);
              const confirmedDrivers = this.userId2Drivers.get(this.userId!);
              if(confirmedDrivers) {
                this.userId2Drivers.set(this.userId!, { drivers: confirmedDrivers.drivers, confirmed: true });
                this.updateDataArray();
              }
              this.showSnackBar('Updated predictions!');
              this.notifyAboutMadeChanges(false);
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
      if(this.userId) {
        this.predictionService.createMany(newPredictionArray).subscribe({
          next: (newPredictions: Prediction[]) => {
            this.userId2Predictions.set(this.userId!, newPredictions);
            this.userId2Drivers.set(this.userId!, { drivers, confirmed: true });
            this.updateDataArray();
            this.showSnackBar('Created predictions!');
            this.notifyAboutMadeChanges(false);
          },
          error: () => {
            this.showSnackBar(ERROR_MSG);
          }
        });
      }
    }

    private async getUserId2Predictions(): Promise<void> {
      if(this.groupId && this.raceId) {
        const driverArray = await firstValueFrom(this.driverService.getAllDrivers());
        this.drivers = driverArray;
        this.driverArrayToObj();
        this.predictionService.getGroupedPredictions(this.groupId, this.raceId).subscribe(predictionJSON => {
          const predictionMap = new Map<number, Prediction[]>(Object.entries(predictionJSON).map(([key, value]) => [parseInt(key), value]));
          this.userId2Predictions = predictionMap;
          for(const [userId, predictions] of predictionMap) {
            if(userId === this.userId && predictions.length === 0) {
              this.notifyAboutMadeChanges(true); // if we want to have a default order
            }
            let drivers: Driver[] = [];
            let confirmed: boolean = false;
            if(predictions.length > 0) {
              confirmed = true;
              const predictedDrivers: Driver[] = [];
              for(const prediction of predictions) {
                const driverId = prediction.driverId;
                if(driverId) {
                  predictedDrivers.push(this.driverObj[driverId]);
                }
              }
              drivers = predictedDrivers;
            } else {
              drivers = [...this.drivers];
            }
            this.userId2Drivers.set(userId, { drivers, confirmed });
          }
          this.updateDataArray();
        }
      )}
    }

    private getScores(): void {
      if(this.groupId && this.raceId) {
        this.scoreService.getGroupedScores(this.groupId, this.raceId).subscribe(scoreJSON => {
          const scoreMap = new Map<number, Score[]>(Object.entries(scoreJSON).map(([key, value]) => [parseInt(key), value]));
          this.userId2Scores = scoreMap;
          for(const scores of scoreMap.values()) {
            if(scores.length > 0) {
              this.scoreAvailable = true;
              break;
            }
          }
        });
      }
    }

    private getRace(): void {
      if(this.raceId) {
        this.raceService.getById(this.raceId).subscribe(race => {
          this.race = race;
          if(this.race.date) {
            if(typeof this.race.date === 'string') {
              this.race.date = new Date(this.race.date);
            }
            this.updateTimeLeft(this.race.date);
          }
        });
      }
    }

    private updateTimeLeft(raceDate: Date): void {
      const currentDate = new Date();
      const timeDiff = raceDate.getTime() - currentDate.getTime();
      if(timeDiff < 0) {
        this.raceFinished = true;
        return;
      }
      let timeLeftSeconds = timeDiff;

      this.raceIntervalId = setInterval(() => {
        timeLeftSeconds -= 1000;
        this.timeLeft = this.dateUtilService.getTimeLeft(timeLeftSeconds);
        this.raceEventService.notifyAboutRaceTime(this.timeLeft);

        if (timeLeftSeconds <= 0) {
          clearInterval(this.raceIntervalId);
        }
      }, 1000);
    }

    private driverArrayToObj(): void {
      this.drivers.forEach((driver) => {
        if(driver.id) {
          this.driverObj[driver.id] = driver;
        }
      });
    }

    private getUserId(): void {
      const userId = this.localStorageService.getUserId();
      if(userId) {
        this.userId = userId;
      }
    }

    private showSnackBar(msg: string): void {
      this.snackBar.open(msg, 'OK', {
        duration: 3000
      });
    }

    private updateDataArray(): void {
      this.dataArray = Array.from(this.userId2Drivers);
    }

    private notifyAboutMadeChanges(madeChanges: boolean): void {
      this.raceEventService.notifyAboutMadeChanges(madeChanges);
    }

}
