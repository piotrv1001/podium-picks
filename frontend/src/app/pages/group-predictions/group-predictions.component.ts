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

@Component({
  selector: 'app-group-predictions',
  templateUrl: './group-predictions.component.html',
  styleUrls: ['./group-predictions.component.scss']
})
export class GroupPredictionsComponent implements OnInit {

  drivers: Driver[] = [];
  raceId?: number;
  userId?: number;
  groupId?: number;
  userId2Predictions: Map<number, Prediction[]> = new Map<number, Prediction[]>();
  race?: Race;
  madeChanges: boolean = false;
  timeLeft?: CustomDate;
  raceFinished: boolean = false;

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
      this.getRace();
      this.getAllDrivers();
      this.getUserId2Predictions();
    }

    private getUserId2Predictions(): void {
      if(this.groupId && this.raceId) {
        this.predictionService.getGroupedPredictions(this.groupId, this.raceId).subscribe(predictions => {
          this.userId2Predictions = predictions;
          console.log('predictions', this.userId2Predictions);
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

    private getAllDrivers(): void {
      this.driverService.getAllDrivers().subscribe(drivers => {
        if(this.drivers.length === 0) {
          this.drivers = drivers;
        }
      });
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

}
