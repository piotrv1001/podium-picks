import { Component, OnInit } from "@angular/core";
import { Driver } from "src/app/model/entities/driver.model";
import { DriverService } from "src/app/services/driver.service";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-driver-drag-drop',
  templateUrl: './driver-drag-drop.component.html',
  styleUrls: ['./driver-drag-drop.component.scss']
})
export class DriverDragDropComponent implements OnInit {

  drivers: Driver[] = [];

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.getAllDrivers();
  }

  drop(event: CdkDragDrop<Driver[]>) {
    moveItemInArray(this.drivers, event.previousIndex, event.currentIndex);
  }

  private getAllDrivers(): void {
    this.driverService.getAllDrivers().subscribe(drivers => {
      this.drivers = drivers;
    });
  }

}
