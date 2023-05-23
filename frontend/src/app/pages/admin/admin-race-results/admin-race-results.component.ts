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
import { RaceService } from 'src/app/services/race.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector:'app-admin-race-results',
  templateUrl:'admin-race-results.component.html',
  styleUrls:['admin-race-results.component.scss']
})
export class AdminRaceResultsComponent implements OnInit  {

  raceId?: number;
  drivers: Driver[] = [];
  driverObj: { [id: number]: Driver } = {};
  results: Result[] = [];
  madeChanges: boolean = false;
  fastestLapDriver?: Driver;
  dnfDrivers: Driver[] = [];

  constructor(
    private router: Router,
    private driverService: DriverService,
    private resultService: ResultService,
    private snackBar: MatSnackBar,
    private raceEventService: RaceEventService,
    public translateService: TranslateService,
    private raceService: RaceService,
    private navigationService: NavigationService) {
    this.raceId = this.router.getCurrentNavigation()?.extras?.state?.['raceId'];
  }

  async ngOnInit() {
    this.navigationService.notifyAboutInitRoute('results');
    const driverArray = await firstValueFrom(this.driverService.getAllDrivers());
    this.drivers = driverArray;
    this.driverArrayToObj();
    this.getMadeChanges();
    this.getRaceWithFLandDNF();
    this.getRaceResults();
  }

  handleResultSaveBtnClick() {
    const drivers = this.raceEventService.getDrivers();
    this.saveDnfAndFastestLap();
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

  onSelectionChange(): void {
    if(this.fastestLapDriver && this.dnfDrivers.length > 0) {
      this.madeChanges = true;
    } else {
      this.madeChanges = false;
    }
  }

  private getRaceWithFLandDNF(): void {
    if(this.raceId !== undefined) {
      this.raceService.getByIdWithFLandDNF(this.raceId).subscribe(race => {
        if(race.fastestLapDriver && race.fastestLapDriver.id !== undefined) {
          this.fastestLapDriver = this.driverObj[race.fastestLapDriver.id];
        }
        if(race.dnfDrivers) {
          for(const dnf of race.dnfDrivers) {
            if(dnf.id !== undefined) {
              this.dnfDrivers.push(this.driverObj[dnf.id]);
            }
          }
        }
      });
    }
  }

  private saveDnfAndFastestLap(): void {
    if(this.raceId !== undefined && this.fastestLapDriver) {
      const dnfDriverIds = this.dnfDrivers.map(dnfDriver => dnfDriver.id!);
      this.raceService.assignDnfDrivers(this.raceId, dnfDriverIds).subscribe();
      this.raceService.assignFastestLap(this.raceId, this.fastestLapDriver.id!).subscribe();
    }
  }

  private getMadeChanges(): void {
    this.raceEventService.getMadeChangesObservable().subscribe(madeChanges => {
      this.madeChanges = madeChanges && this.fastestLapDriver !== undefined;
    });
  }

  private createResults(drivers: Driver[]): void {
    const newResultArray: ResultDTO[] = [];
    drivers.forEach((driver: Driver, index: number) => {
      if(driver.id !== undefined && this.raceId !== undefined) {
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

  private getRaceResults(): void {
    if(this.raceId !== undefined) {
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
          this.driverArrayToObj();
          if(this.fastestLapDriver && this.fastestLapDriver.id !== undefined) {
            this.fastestLapDriver = this.driverObj[this.fastestLapDriver.id];
          }
          const dnfDrivers: Driver[] = [];
          for(const dnf of this.dnfDrivers) {
            if(dnf.id !== undefined) {
              dnfDrivers.push(this.driverObj[dnf.id]);
            }
          }
          this.dnfDrivers = dnfDrivers;
        } else {
          this.notifyAboutMadeChanges(true);
        }
      })
    }
  }

  private driverArrayToObj(): void {
    this.drivers.forEach((driver) => {
      if(driver.id !== undefined) {
        this.driverObj[driver.id] = driver;
      }
    });
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
