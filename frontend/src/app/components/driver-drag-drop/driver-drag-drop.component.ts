import { DateUtilService } from './../../shared/util/date-util.service';
import { Component, OnInit } from "@angular/core";
import { Driver } from "src/app/model/entities/driver.model";
import { DriverService } from "src/app/services/driver.service";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from "@angular/router";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { PredictionService } from "src/app/services/prediction.service";
import { Prediction } from "src/app/model/entities/prediction.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PredictionDTO } from "src/app/model/dto/prediction.dto";
import { ERROR_MSG } from "src/app/app.constants";
import { RaceService } from "src/app/services/race.service";
import { Race } from "src/app/model/entities/race.model";
import { CustomDate } from 'src/app/model/types/custom-date';

@Component({
  selector: 'app-driver-drag-drop',
  templateUrl: './driver-drag-drop.component.html',
  styleUrls: ['./driver-drag-drop.component.scss']
})
export class DriverDragDropComponent implements OnInit {

  drivers: Driver[] = [];
  raceId?: number;
  userId?: number;
  groupId?: number;
  predictions: Prediction[] = [];
  race?: Race;
  madeChanges: boolean = false;
  timeLeft?: CustomDate;

  constructor(
    private driverService: DriverService,
    private raceService: RaceService,
    private predictionService: PredictionService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dateUtilService: DateUtilService) {
      this.raceId = this.router.getCurrentNavigation()?.extras?.state?.["raceId"];
      this.groupId = this.router.getCurrentNavigation()?.extras?.state?.["groupId"];
    }

  get timer(): string {
    if(this.timeLeft) {
      if(this.timeLeft.days < 0 || this.timeLeft.hours < 0) {
        return 'Race finished';
      }
      const minutes = this.timeLeft.minutes.toString().padStart(2, '0');
      const seconds = this.timeLeft.seconds.toString().padStart(2, '0');
      const days = this.timeLeft.days > 0 ? `${this.timeLeft.days} Days, ` : '';
      return `${days}${this.timeLeft.hours}:${minutes}:${seconds}`;
    }
    return '0 Days, 00:00:00';
  }

  ngOnInit(): void {
    this.getRace();
    this.getAllDrivers();
    this.getPredictionsForUserForRace();
  }

  savePredictions(): void {
    const isUpdate = this.predictions.length !== 0;
    if(isUpdate) {
      this.updatePredictions();
    } else {
      this.createPredictions();
    }
  }

  drop(event: CdkDragDrop<Driver[]>) {
    this.madeChanges = true;
    moveItemInArray(this.drivers, event.previousIndex, event.currentIndex);
    if(this.predictions.length > 0) {
      const lower = Math.min(event.previousIndex, event.currentIndex);
      const upper = Math.max(event.previousIndex, event.currentIndex);
      for(let i = lower; i <= upper; i++) {
        const driverIndex = this.predictions.findIndex(prediction => prediction.driverId === this.drivers[i].id);
        if(driverIndex !== -1) {
          this.predictions[driverIndex].predictedPosition = i + 1;
        }
      }
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

  private updatePredictions(): void {
    this.predictionService.updateMany(this.predictions).subscribe({
      next: (predictions) => {
        this.predictions = predictions;
        this.showSnackBar('Updated predictions!');
        this.madeChanges = false;
      },
      error: () => {
        this.showSnackBar(ERROR_MSG);
      }
    })
  }

  private createPredictions(): void {
    const newPredictionArray: PredictionDTO[] = [];
    this.drivers.forEach((driver: Driver, index: number) => {
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
    this.predictionService.createMany(newPredictionArray).subscribe((predictions) => {
      this.predictions = predictions;
      this.showSnackBar('Created predictions!');
      this.madeChanges = false;
    });
  }

  private getAllDrivers(): void {
    this.driverService.getAllDrivers().subscribe(drivers => {
      if(this.drivers.length === 0) {
        this.drivers = drivers;
      }
    });
  }

  private showSnackBar(msg: string): void {
    this.snackBar.open(msg, 'OK', {
      duration: 3000
    });
  }

  private getPredictionsForUserForRace(): void {
    const userId = this.localStorageService.getUserId();
    if(userId && this.raceId && this.groupId) {
      this.userId = userId;
      this.predictionService.getByUserAndRaceAndGroup(userId, this.raceId, this.groupId).subscribe(predictions => {
        this.predictions = predictions;
        if(predictions.length > 0) {
          const predictedDrivers: Driver[] = [];
          for(const prediction of predictions) {
            if(prediction.driver) {
              predictedDrivers.push(prediction.driver);
            } else {
              return;
            }
          }
          this.drivers = predictedDrivers;
        }
      });
    }
  }

  private updateTimeLeft(raceDate: Date): void {
    const currentDate = new Date();
    const timeDiff = raceDate.getTime() - currentDate.getTime();
    let timeLeftSeconds = timeDiff;

    const intervalId = setInterval(() => {
      timeLeftSeconds -= 1000;
      this.timeLeft = this.dateUtilService.getTimeLeft(timeLeftSeconds);

      if (timeLeftSeconds <= 0) {
        clearInterval(intervalId);
      }
    }, 1000);
  }


}
