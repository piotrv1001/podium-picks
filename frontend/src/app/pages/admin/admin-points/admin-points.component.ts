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
import { BonusStatService } from "src/app/services/bonus-stat.service";
import { BonusStatEnum } from "src/app/model/types/bonus-stat-enum";
import { BonusStatDTO } from "src/app/model/dto/bonus-stat.dto";
import { BonusStat } from "src/app/model/entities/bonus-stat.model";
import { firstValueFrom } from "rxjs";
import { NavigationService } from "src/app/services/navigation.service";

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
  total: number = 0;
  fastestLapDriver?: Driver;
  dnfDriver?: Driver;
  fastestLapPoints: number = 0;
  dnfPoints: number = 0;
  driverObj: { [id: number]: Driver } = {};
  madePredictionChanges: boolean = false;
  madePointChanges: boolean = false;
  bonusArray: BonusStat[] = [];
  loading = false;

  constructor(
    private router: Router,
    private scoreService: ScoreService,
    private predictionService: PredictionService,
    private snackBar: MatSnackBar,
    private raceEventService: RaceEventService,
    public translateService: TranslateService,
    private driverService: DriverService,
    private bonusStatService: BonusStatService,
    private navigationService: NavigationService
  ) {
    const navState = this.router.getCurrentNavigation()?.extras?.state
    this.raceId = navState?.["raceId"];
    this.userId = navState?.["userId"];
    this.groupId = navState?.["groupId"];
  }

  ngOnInit(): void {
    this.navigationService.notifyAboutInitRoute('points');
    this.getMadeChanges();
    this.getDrivers();
    this.getScores();
    this.getPredictions();
    this.getBonusStats();
  }

  async handlePredictionSaveBtnClick(): Promise<void> {
    this.loading = true;
    let drivers = this.raceEventService.getDrivers();
    if(drivers.length === 0) {
      drivers = this.drivers;
    }
    this.setTabAnimationDuration(0);
    if(this.userId !== undefined) {
      await this.saveBonusStats();
      const isUpdate = this.predictions.length !== 0;
      if(isUpdate) {
        this.updatePredictions();
      } else {
        this.createPredictions(drivers);
      }
    } else {
      this.loading = false;
      const msg = this.translateService.instant('error.userNotFound');
      this.showSnackBar(msg);
    }
  }

  handleScoreUpdate(score: Score): void {
    this.madePointChanges = true;
    this.updatedScores.push(score);
    this.calculateTotal();
  }

  handleSavePointsBtnClick(): void {
    this.updateScores();
    this.saveBonusStats();
  }

  handleModelChange(): void {
    this.madePredictionChanges = true;
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

  fastestLapPointsChanged(increment: boolean): void {
    this.fastestLapPoints += increment ? 0.5 : -0.5;
    this.calculateTotal();
    this.madePointChanges = true;
  }

  dnfPointsChanged(increment: boolean): void {
    this.dnfPoints += increment ? 0.5 : -0.5;
    this.calculateTotal();
    this.madePointChanges = true;
  }

  private getBonusStats(): void {
    if(this.raceId !== undefined && this.groupId !== undefined && this.userId !== undefined) {
      this.bonusStatService.getByRaceGroupUser(this.raceId, this.groupId, this.userId).subscribe(bonusStats => {
        this.bonusArray = bonusStats;
        this.assignBonusStats();
      });
    }
  }

  private async saveBonusStats(): Promise<void> {
    const isUpdate = this.bonusArray.length > 0;
    if(this.userId !== undefined && isUpdate) {
      const fastestLapStat = this.bonusArray.find(bonusStat => bonusStat.bonusStatDictId === BonusStatEnum.FASTEST_LAP);
      if(fastestLapStat) {
        fastestLapStat.driver = this.fastestLapDriver;
        fastestLapStat.points = this.fastestLapPoints;
      }
      const dnfStat = this.bonusArray.find(bonusStat => bonusStat.bonusStatDictId === BonusStatEnum.DNF);
      if(dnfStat) {
        dnfStat.driver = this.dnfDriver;
        dnfStat.points = this.dnfPoints;
      }
      const bonusStats = await firstValueFrom(this.bonusStatService.updateMany(this.bonusArray));
      this.bonusArray = bonusStats;
      this.assignBonusStats();
      this.calculateTotal();
    } else {
      if(this.raceId !== undefined && this.groupId !== undefined && this.userId !== undefined) {
        const fastestLapDriver = this.fastestLapDriver;
        const dnfDriver = this.dnfDriver;
        if(fastestLapDriver && fastestLapDriver.id !== undefined && dnfDriver && dnfDriver.id !== undefined) {
          const fastestLapBonusStat = new BonusStatDTO(
            BonusStatEnum.FASTEST_LAP,
            this.raceId,
            this.groupId,
            this.userId,
            fastestLapDriver.id
          );
          const dnfBonusStat = new BonusStatDTO(
            BonusStatEnum.DNF,
            this.raceId,
            this.groupId,
            this.userId,
            dnfDriver.id
          );
          const bonusStats = await firstValueFrom(this.bonusStatService.createMany([fastestLapBonusStat, dnfBonusStat]));
          this.bonusArray = bonusStats;
          this.assignBonusStats();
          this.calculateTotal();
        }
      }
    }
  }

  private assignBonusStats(): void {
    const fastestLapStat = this.bonusArray.find(bonusStat => bonusStat.bonusStatDictId === BonusStatEnum.FASTEST_LAP);
    if(fastestLapStat && fastestLapStat.driverId !== undefined) {
      this.fastestLapDriver = this.driverObj[fastestLapStat.driverId];
      let fastestLapPoints = fastestLapStat.points;
      if(typeof fastestLapPoints === 'string') {
        fastestLapPoints = parseFloat(fastestLapPoints);
      }
      this.fastestLapPoints = fastestLapPoints ?? 0;
      const total = this.total;
      if(total !== undefined && fastestLapPoints !== undefined) {
        const newTotal = total + fastestLapPoints;
        this.total = newTotal;
      } else {
        this.total = fastestLapPoints ?? 0;
      }
    }
    const dnfStat = this.bonusArray.find(bonusStat => bonusStat.bonusStatDictId === BonusStatEnum.DNF);
    if(dnfStat && dnfStat.driverId !== undefined) {
      this.dnfDriver = this.driverObj[dnfStat.driverId];
      let dnfPoints = dnfStat.points;
      if(typeof dnfPoints === 'string') {
        dnfPoints = parseFloat(dnfPoints);
      }
      this.dnfPoints = dnfPoints ?? 0;
      const total = this.total;
      if(total !== undefined && dnfPoints !== undefined) {
        const newTotal = total + dnfPoints;
        this.total = newTotal;
      } else {
        this.total = dnfPoints ?? 0;
      }
    }
  }

  private driverArrayToObj(): void {
    this.drivers.forEach((driver) => {
      if(driver.id !== undefined) {
        this.driverObj[driver.id] = driver;
      }
    });
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
              const bonusStats = updatedPredictions?.bonusStats;
              if(bonusStats) {
                this.bonusArray = bonusStats;
                this.assignBonusStats();
              }
            }
            this.calculateTotal();
            const msg = this.translateService.instant('race.predictions.updated');
            this.showSnackBar(msg);
            this.notifyAboutMadeChanges(false);
            setTimeout(() => {
              this.setTabAnimationDuration(400);
            }, 0);
            this.loading = false;
          },
          error: () => {
            this.loading = false;
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
            const bonusStats = newPredictions?.bonusStats;
              if(bonusStats) {
                this.bonusArray = bonusStats;
                this.assignBonusStats();
              }
          }
          this.calculateTotal();
          const msg = this.translateService.instant('race.predictions.created');
          this.showSnackBar(msg);
          this.notifyAboutMadeChanges(false);
          setTimeout(() => {
            this.setTabAnimationDuration(400);
          }, 0);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.showSnackBar(ERROR_MSG);
        }
      });
    }
  }

  private getMadeChanges(): void {
    this.raceEventService.getMadeChangesObservable().subscribe(madeChanges => {
      this.madePredictionChanges = madeChanges;
    });
  }

  private getScores(): void {
    if(this.userId != null && this.groupId != null && this.raceId != null) {
      this.scoreService.getByUserGroupRace(this.userId, this.groupId, this.raceId).subscribe(scores => {
        this.scores = scores;
        this.calculateTotal();
      });
    }
  }

  private calculateTotal(): void {
    this.total = this.fastestLapPoints + this.dnfPoints;
    if(this.scores.length > 0) {
      for(const score of this.scores) {
        if(score.points !== undefined) {
          if(typeof score.points === 'string') {
            this.total += parseFloat(score.points);
          } else {
            this.total += score.points;
          }
        }
      }
    }
  }

  private getPredictions(): void {
    if(this.userId != null && this.groupId != null && this.raceId != null) {
      this.predictionService.getByUserAndRaceAndGroup(this.userId, this.raceId, this.groupId).subscribe(predictions => {
        this.predictions = predictions;
        if(predictions.length > 0) {
          this.drivers = predictions.map(prediction => prediction.driver!);
          this.driverArrayToObj();
        }
      });
    }
  }

  private getDrivers(): void {
    this.driverService.getAllDrivers().subscribe(drivers => {
      if(this.drivers.length === 0) {
        this.drivers = drivers;
        this.driverArrayToObj();
      }
    });
  }

  private updateScores(): void {
    this.scoreService.updateMany(this.updatedScores).subscribe({
      next: () => {
        const msg = this.translateService.instant('race.points.updated');
        this.showSnackBar(msg);
        this.raceEventService.notifyAboutMadeChanges(false);
        this.madePointChanges = false;
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
