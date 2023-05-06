import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Driver } from 'src/app/model/entities/driver.model';
import { DriverService } from 'src/app/services/driver.service';
import { firstValueFrom } from 'rxjs';
import { ResultService } from 'src/app/services/result.service';
import { Result } from 'src/app/model/entities/result.model';
import { DragDropEvent } from 'src/app/model/types/drag-drop-event';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResultDTO } from 'src/app/model/dto/result.dto';
import { ERROR_MSG } from 'src/app/app.constants';
import { RaceEventService } from 'src/app/services/race-event.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector:'app-admin-race-results',
  templateUrl:'admin-race-results.component.html',
  styleUrls:['admin-race-results.component.scss']
})
export class AdminRaceResultsComponent implements OnInit  {

  raceId?: number;
  drivers: Driver[] = [];
  results: Result[] = [];
  madeChanges: boolean = false;

  constructor(
    private router: Router,
    private driverService: DriverService,
    private resultService: ResultService,
    private snackBar: MatSnackBar,
    private raceEventService: RaceEventService,
    public translateService: TranslateService) {
    this.raceId = this.router.getCurrentNavigation()?.extras?.state?.['raceId'];
  }

  ngOnInit() {
    this.getMadeChanges();
    this.getRaceResutls();
  }

  handleResultSaveBtnClick() {
    const drivers = this.raceEventService.getDrivers();
    const isUpdate = this.results.length !== 0;
    if(isUpdate) {
      this.updateResults();
    } else {
      this.createResults(drivers);
    }
  }

  handleDriverDragDrop(dragDropEvent: DragDropEvent): void {
    if(this.results.length > 0) {
      const lower = Math.min(dragDropEvent.previousIndex, dragDropEvent.currentIndex);
      const upper = Math.max(dragDropEvent.previousIndex, dragDropEvent.currentIndex);
      for(let i = lower; i <= upper; i++) {
        const driverIndex = this.results.findIndex(prediction => prediction.driverId === dragDropEvent.drivers[i].id);
        if(driverIndex !== -1) {
          this.results[driverIndex].position = i + 1;
        }
      }
    }
  }

  private getMadeChanges(): void {
    this.raceEventService.getMadeChangesObservable().subscribe(madeChanges => {
      this.madeChanges = madeChanges;
    });
  }

  private createResults(drivers: Driver[]): void {
    const newResultArray: ResultDTO[] = [];
    drivers.forEach((driver: Driver, index: number) => {
      if(driver.id && this.raceId) {
        const newResult = new ResultDTO(
          index + 1,
          this.raceId,
          driver.id
        );
        newResultArray.push(newResult);
      } else {
        this.showSnackBar(ERROR_MSG);
        return;
      }
    });
    this.resultService.createMany(newResultArray).subscribe({
      next: (newResults: Result[]) => {
        this.results = newResults;
        this.drivers = drivers;
        const msg = this.translateService.instant('race.results.created');
        this.showSnackBar(msg);
        this.notifyAboutMadeChanges(false);
      },
      error: (error: Error) => {
        this.showSnackBar(error.message);
      }
    });
  }

  private updateResults(): void {
    this.resultService.updateMany(this.results).subscribe({
      next: (updatedResults: Result[]) => {
        this.results = updatedResults;
        const msg = this.translateService.instant('race.results.updated');
        this.showSnackBar(msg);
        this.notifyAboutMadeChanges(false);
      },
      error: (error: Error) => {
        this.showSnackBar(error.message);
      }
    });
  }

  private async getRaceResutls(): Promise<void> {
    const driverArray = await firstValueFrom(this.driverService.getAllDrivers());
    this.drivers = driverArray;
    if(this.raceId) {
      this.resultService.getByRaceId(this.raceId).subscribe(results => {
        this.results = results;
        if(results.length > 0) {
          const resultDrivers: Driver[] = [];
          for(const result of results) {
            if(result.driver) {
              resultDrivers.push(result.driver);
            } else {
              return;
            }
          }
          this.drivers = resultDrivers;
        } else {
          this.notifyAboutMadeChanges(true);
        }
      })
    }
  }

  private showSnackBar(msg: string): void {
    this.snackBar.open(msg, 'OK', {
      duration: 3000
    });
  }

  private notifyAboutMadeChanges(madeChanges: boolean): void {
    this.raceEventService.notifyAboutMadeChanges(madeChanges);
  }

}
