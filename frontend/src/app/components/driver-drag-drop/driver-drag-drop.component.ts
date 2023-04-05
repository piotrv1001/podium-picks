import { Component, OnInit } from "@angular/core";
import { Driver } from "src/app/model/entities/driver.model";
import { DriverService } from "src/app/services/driver.service";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from "@angular/router";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { PredictionService } from "src/app/services/prediction.service";
import { Prediction } from "src/app/model/entities/prediction.model";

@Component({
  selector: 'app-driver-drag-drop',
  templateUrl: './driver-drag-drop.component.html',
  styleUrls: ['./driver-drag-drop.component.scss']
})
export class DriverDragDropComponent implements OnInit {

  drivers: Driver[] = [];
  raceId?: number;
  predictions: Prediction[] = [];

  constructor(
    private driverService: DriverService,
    private predictionService: PredictionService,
    private localStorageService: LocalStorageService,
    private router: Router) {
      this.raceId = this.router.getCurrentNavigation()?.extras?.state?.["raceId"];
    }

  ngOnInit(): void {
    this.getAllDrivers();
    this.getPredictionsForUserForRace();
  }

  drop(event: CdkDragDrop<Driver[]>) {
    moveItemInArray(this.drivers, event.previousIndex, event.currentIndex);
  }

  private getAllDrivers(): void {
    this.driverService.getAllDrivers().subscribe(drivers => {
      if(this.drivers.length === 0) {
        this.drivers = drivers;
      }
    });
  }

  private getPredictionsForUserForRace(): void {
    const userId = this.localStorageService.getUserId();
    if(userId && this.raceId) {
      this.predictionService.getByUserAndRace(userId, this.raceId).subscribe(predictions => {
        this.predictions = predictions;
        const predictedDrivers: Driver[] = [];
        for(const prediction of predictions) {
          if(prediction.driver) {
            predictedDrivers.push(prediction.driver);
          } else {
            return;
          }
        }
        this.drivers = predictedDrivers;
      });
    }
  }

}
