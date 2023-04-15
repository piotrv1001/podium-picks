import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-group-predictions',
  templateUrl: './group-predictions.component.html',
  styleUrls: ['./group-predictions.component.scss']
})
export class GroupPredictionsComponent implements OnInit {

  drivers: Driver[] = [];
  driverObj: { [id: number]: Driver } = {};
  raceId?: number;
  userId?: number;
  groupId?: number;
  userId2Predictions: Map<number, Prediction[]> = new Map<number, Prediction[]>();
  userId2Drivers: Map<number, ConfirmedDrivers> = new Map<number, ConfirmedDrivers>();
  dataArray: [number, ConfirmedDrivers][] = [];
  race?: Race;
  timeLeft?: CustomDate;
  raceFinished: boolean = false;
  madeChanges: boolean = false;

  constructor(
    private driverService: DriverService,
    private raceService: RaceService,
    private predictionService: PredictionService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dateUtilService: DateUtilService) {
      const navState = this.router.getCurrentNavigation()?.extras?.state
      this.raceId = navState?.["raceId"];
      this.groupId = navState?.["groupId"];
    }

    ngOnInit(): void {
      this.getUserId();
      this.getRace();
      this.getUserId2Predictions();
    }

    get timer(): string {
      if(this.raceFinished) {
        return 'Race finished';
      }
      if(this.timeLeft) {
        const minutes = this.timeLeft.minutes.toString().padStart(2, '0');
        const seconds = this.timeLeft.seconds.toString().padStart(2, '0');
        const days = this.timeLeft.days > 0 ? `${this.timeLeft.days} Days, ` : '';
        return `${days}${this.timeLeft.hours}:${minutes}:${seconds}`;
      }
      return '0 Days, 00:00:00';
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
        if(predictions) {
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
              this.showSnackBar('Updated predictions!');
              this.madeChanges = false;
            },
            error: () => {
              this.showSnackBar(ERROR_MSG);
            }
          })
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
        this.predictionService.createMany(newPredictionArray).subscribe((newPredictions) => {
          this.userId2Predictions.set(this.userId!, newPredictions);
          this.showSnackBar('Created predictions!');
          this.madeChanges = false;
        });
      }
    }

    private async getUserId2Predictions(): Promise<void> {
      const driverArray = await firstValueFrom(this.driverService.getAllDrivers());
      this.drivers = driverArray;
      this.driverArrayToObj();
      if(this.groupId && this.raceId) {
        this.predictionService.getGroupedPredictions(this.groupId, this.raceId).subscribe(predictionJSON => {
          const predictionMap = new Map<number, Prediction[]>(Object.entries(predictionJSON).map(([key, value]) => [parseInt(key), value]));
          this.userId2Predictions = predictionMap;
          for(const [userId, predictions] of predictionMap) {
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
          this.dataArray = Array.from(this.userId2Drivers);
        }
      )}
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

      const intervalId = setInterval(() => {
        timeLeftSeconds -= 1000;
        this.timeLeft = this.dateUtilService.getTimeLeft(timeLeftSeconds);

        if (timeLeftSeconds <= 0) {
          clearInterval(intervalId);
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

}
