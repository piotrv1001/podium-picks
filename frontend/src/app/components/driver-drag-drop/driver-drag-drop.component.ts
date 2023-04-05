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

@Component({
  selector: 'app-driver-drag-drop',
  templateUrl: './driver-drag-drop.component.html',
  styleUrls: ['./driver-drag-drop.component.scss']
})
export class DriverDragDropComponent implements OnInit {

  drivers: Driver[] = [];
  raceId?: number;
  userId?: number;
  predictions: Prediction[] = [];

  constructor(
    private driverService: DriverService,
    private predictionService: PredictionService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private snackBar: MatSnackBar) {
      this.raceId = this.router.getCurrentNavigation()?.extras?.state?.["raceId"];
    }

  ngOnInit(): void {
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
    moveItemInArray(this.drivers, event.previousIndex, event.currentIndex);
  }

  private updatePredictions(): void {

  }

  private createPredictions(): void {
    const newPredictionArray: PredictionDTO[] = [];
    this.drivers.forEach((driver: Driver, index: number) => {
      if(driver.id && this.raceId && this.userId) {
        const newPrediction = new PredictionDTO(
          index + 1,
          driver.id,
          this.raceId,
          this.userId
        );
        newPredictionArray.push(newPrediction);
      } else {
        this.showSnackBar('Error occured. Try again later.');
        return;
      }
    });
    this.predictionService.createMany(newPredictionArray).subscribe(() => {
      this.showSnackBar('Created predictions!');
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
    if(userId && this.raceId) {
      this.userId = userId;
      this.predictionService.getByUserAndRace(userId, this.raceId).subscribe(predictions => {
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

}
