import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Driver } from 'src/app/model/entities/driver.model';
import { Prediction } from 'src/app/model/entities/prediction.model';
import { Race } from 'src/app/model/entities/race.model';
import { CustomDate } from 'src/app/model/types/custom-date';
import { DriverService } from 'src/app/services/driver.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PredictionOutput, PredictionService } from 'src/app/services/prediction.service';
import { RaceService } from 'src/app/services/race.service';
import { DateUtilService } from 'src/app/shared/util/date-util.service';
import { firstValueFrom } from 'rxjs';
import { DragDropEvent } from 'src/app/model/types/drag-drop-event';
import { ERROR_MSG } from 'src/app/app.constants';
import { PredictionDTO } from 'src/app/model/dto/prediction.dto';
import { RaceEventService } from 'src/app/services/race-event.service';
import { ScoreService } from 'src/app/services/score.service';
import { Score } from 'src/app/model/entities/score.model';
import { GroupService } from 'src/app/services/group.service';
import { User } from 'src/app/model/entities/user.model';
import { TranslateService } from '@ngx-translate/core';
import { MatTabGroup } from '@angular/material/tabs';
import { RaceStatus } from 'src/app/model/types/race-status';
import { BonusStatService } from 'src/app/services/bonus-stat.service';
import { UserData } from 'src/app/model/types/user-data';
import { BonusStat } from 'src/app/model/entities/bonus-stat.model';
import { BonusStatEnum } from 'src/app/model/types/bonus-stat-enum';
import { BonusStatDTO } from 'src/app/model/dto/bonus-stat.dto';
import { NavigationService } from 'src/app/services/navigation.service';

type DataArray = [number, UserData][];

@Component({
  selector: 'app-group-predictions',
  templateUrl: './group-predictions.component.html',
  styleUrls: ['./group-predictions.component.scss']
})
export class GroupPredictionsComponent implements OnInit, OnDestroy {

  @ViewChild('tabGroup') tabGroup?: MatTabGroup;
  drivers: Driver[] = [];
  driverObj: { [id: number]: Driver } = {};
  raceId?: number;
  userId?: number;
  groupId?: number;
  userId2UserData: Map<number, UserData> = new Map<number, UserData>();
  dataArray: DataArray = [];
  race?: Race;
  timeLeft?: CustomDate;
  raceFinished: boolean = false;
  madeChanges: boolean = false;
  raceIntervalId?: any;
  scoreAvailable: boolean = false;
  selectedDNF?: Driver;
  selectedFL?: Driver;
  raceStatus: RaceStatus = RaceStatus.BEFORE_DEADLINE;
  loading: boolean = true;
  RaceStatus = RaceStatus;
  bonusArray: BonusStat[] = [];

  constructor(
    private driverService: DriverService,
    private raceService: RaceService,
    private predictionService: PredictionService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dateUtilService: DateUtilService,
    private raceEventService: RaceEventService,
    private scoreService: ScoreService,
    private groupService: GroupService,
    public translateService: TranslateService,
    private bonusStatService: BonusStatService,
    private navigationService: NavigationService) {
      const navState = this.router.getCurrentNavigation()?.extras?.state
      this.raceId = navState?.["raceId"];
      this.groupId = navState?.["groupId"];
      if(this.groupId !== undefined) {
        localStorage.setItem('groupId', this.groupId.toString());
      }
      if(this.raceId !== undefined) {
        localStorage.setItem('raceId', this.raceId.toString());
      }
    }

    ngOnInit(): void {
      this.navigationService.notifyAboutInitRoute('drivers');
      this.getMadeChanges();
      this.getRace();
      this.getUserId();
      this.getUsersByGroup();
      this.getUserId2Predictions();
      this.getBonusStats();
      this.getScores();
    }

    ngOnDestroy(): void {
      clearInterval(this.raceIntervalId);
    }

    selectedDriverChanged(): void {
      if(this.selectedDNF && this.selectedFL) {
        this.madeChanges = true;
      }
    }

    handlePredictionSaveBtnClick(): void {
      let drivers = this.raceEventService.getDrivers();
      if(drivers.length === 0) {
        drivers = this.drivers;
      }
      this.setTabAnimationDuration(0);
      if(this.userId !== undefined) {
        const isUpdate = this.userId2UserData.get(this.userId)?.predictions?.length !== 0;
        if(isUpdate) {
          this.updatePredictions();
        } else {
          this.createPredictions(drivers);
        }
        this.saveBonusStats();
      } else {
        const msg = this.translateService.instant('error.userNotFound');
        this.showSnackBar(msg);
      }
    }

    handleDriverDragDrop(dragDropEvent: DragDropEvent): void {
      if(this.userId) {
        const predictions = this.userId2UserData.get(this.userId)?.predictions
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

    private getBonusStats(): void {
      if(this.groupId === undefined) {
        const groupIdStr = localStorage.getItem('groupId');
        if(groupIdStr) {
          this.groupId = Number(groupIdStr);
        }
      }
      if(this.raceId === undefined) {
        const raceIdStr = localStorage.getItem('raceId');
        if(raceIdStr) {
          this.raceId = Number(raceIdStr);
        }
      }
      if(this.raceId !== undefined && this.groupId !== undefined) {
        this.bonusStatService.getByRaceGroup(this.raceId, this.groupId).subscribe(bonusStatJSON => {
          const bonusStatMap = new Map<number, BonusStat[]>(Object.entries(bonusStatJSON).map(([key, value]) => [parseInt(key), value]));
          for(const [userId, bonusStats] of bonusStatMap) {
            if(userId === this.userId) {
              this.bonusArray = bonusStats;
            }
            const fastestLapStat = bonusStats.find(bonusStat => bonusStat.bonusStatDictId === BonusStatEnum.FASTEST_LAP);
            if(fastestLapStat && fastestLapStat.driverId !== undefined) {
              const fastestLapDriver = this.driverObj[fastestLapStat.driverId];
              let fastestLapPoints = fastestLapStat.points;
              if(typeof fastestLapPoints === 'string') {
                fastestLapPoints = parseFloat(fastestLapPoints);
              }
              const total = this.userId2UserData.get(userId)?.total;
              if(total !== undefined && fastestLapPoints !== undefined) {
                const newTotal = total + fastestLapPoints;
                this.userDataPartialUpdate(userId, { fastestLapDriver, fastestLapPoints, total: newTotal });
              } else {
                this.userDataPartialUpdate(userId, { fastestLapDriver, fastestLapPoints, total: fastestLapPoints });
              }
            }
            const dnfStat = bonusStats.find(bonusStat => bonusStat.bonusStatDictId === BonusStatEnum.DNF);
            if(dnfStat && dnfStat.driverId !== undefined) {
              const dnfDriver = this.driverObj[dnfStat.driverId];
              let dnfPoints = dnfStat.points;
              if(typeof dnfPoints === 'string') {
                dnfPoints = parseFloat(dnfPoints);
              }
              const total = this.userId2UserData.get(userId)?.total;
              if(total !== undefined && dnfPoints !== undefined) {
                const newTotal = total + dnfPoints;
                this.userDataPartialUpdate(userId, { dnfDriver, dnfPoints, total: newTotal });
              } else {
                this.userDataPartialUpdate(userId, { dnfDriver, dnfPoints, total: dnfPoints });
              }
            }
          }
        });
      }
    }

    private saveBonusStats(): void {
      const isUpdate = this.bonusArray.length > 0;
      if(this.userId !== undefined && isUpdate) {
        const fastestLapStat = this.bonusArray.find(bonusStat => bonusStat.bonusStatDictId === BonusStatEnum.FASTEST_LAP);
        if(fastestLapStat) {
          fastestLapStat.driver = this.userId2UserData.get(this.userId)?.fastestLapDriver;
        }
        const dnfStat = this.bonusArray.find(bonusStat => bonusStat.bonusStatDictId === BonusStatEnum.DNF);
        if(dnfStat) {
          dnfStat.driver = this.userId2UserData.get(this.userId)?.dnfDriver;
        }
        this.bonusStatService.updateMany(this.bonusArray).subscribe();
      } else {
        if(this.raceId !== undefined && this.groupId !== undefined && this.userId !== undefined) {
          const fastestLapDriver = this.userId2UserData.get(this.userId)?.fastestLapDriver;
          const dnfDriver = this.userId2UserData.get(this.userId)?.dnfDriver;
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
            this.bonusStatService.createMany([fastestLapBonusStat, dnfBonusStat]).subscribe();
          }
        }
      }
    }

    private getMadeChanges(): void {
      this.raceEventService.getMadeChangesObservable().subscribe(madeChanges => {
        this.madeChanges = madeChanges;
      });
    }

    private userDataPartialUpdate(userId: number, partial: UserData): void {
      const userData = this.userId2UserData.get(userId);
      this.userId2UserData.set(userId, { ...userData, ...partial });
    }

    private updatePredictions(): void {
      if(this.userId !== undefined) {
        let predictions = this.userId2UserData.get(this.userId)?.predictions
        if(predictions) {
          this.predictionService.updateMany(predictions).subscribe({
            next: (updatedPredictions: PredictionOutput) => {
              if(this.isArrayOfPredictions(updatedPredictions)) {
                this.userDataPartialUpdate(this.userId!, { predictions: updatedPredictions });
              }
              const confirmedDrivers = this.userId2UserData.get(this.userId!)?.confirmedDrivers;
              if(confirmedDrivers) {
                this.userDataPartialUpdate(this.userId!, { confirmedDrivers: { drivers: confirmedDrivers.drivers, confirmed: true } });
                this.updateDataArray();
              }
              const msg = this.translateService.instant('race.predictions.updated');
              this.showSnackBar(msg);
              this.notifyAboutMadeChanges(false);
              setTimeout(() => {
                this.setTabAnimationDuration(400);
              }, 0);
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
      if(this.userId !== undefined) {
        this.predictionService.createMany(newPredictionArray).subscribe({
          next: (newPredictions: PredictionOutput) => {
            if(this.isArrayOfPredictions(newPredictions)) {
              this.userDataPartialUpdate(this.userId!, { predictions: newPredictions });
            }
            this.userDataPartialUpdate(this.userId!, { confirmedDrivers: { drivers, confirmed: true } });
            this.updateDataArray();
            const msg = this.translateService.instant('race.predictions.created');
            this.showSnackBar(msg);
            this.notifyAboutMadeChanges(false);
            setTimeout(() => {
              this.setTabAnimationDuration(400);
            }, 0);
          },
          error: () => {
            this.showSnackBar(ERROR_MSG);
          }
        });
      }
    }

    private async getUserId2Predictions(): Promise<void> {
      if(this.groupId === undefined) {
        const groupIdStr = localStorage.getItem('groupId');
        if(groupIdStr) {
          this.groupId = Number(groupIdStr);
        }
      }
      if(this.raceId === undefined) {
        const raceIdStr = localStorage.getItem('raceId');
        if(raceIdStr) {
          this.raceId = Number(raceIdStr);
        }
      }
      if(this.groupId !== undefined && this.raceId !== undefined) {
        const driverArray = await firstValueFrom(this.driverService.getAllDrivers());
        this.drivers = driverArray;
        this.driverArrayToObj();
        this.predictionService.getGroupedPredictions(this.groupId, this.raceId).subscribe(predictionJSON => {
          const predictionMap = new Map<number, Prediction[]>(Object.entries(predictionJSON).map(([key, value]) => [parseInt(key), value]));
          for(const [userId, predictions] of predictionMap) {
            this.userDataPartialUpdate(userId, { predictions });
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
            this.userDataPartialUpdate(userId, { confirmedDrivers: { drivers, confirmed } });
          }
          this.updateDataArray();
        }
      )}
    }

    private getScores(): void {
      if(this.raceId === undefined) {
        const raceIdStr = localStorage.getItem('raceId');
        if(raceIdStr) {
          this.raceId = Number(raceIdStr);
        }
      }
      if(this.groupId === undefined) {
        const groupIdStr = localStorage.getItem('groupId');
        if(groupIdStr) {
          this.groupId = Number(groupIdStr);
        }
      }
      if(this.groupId !== undefined && this.raceId !== undefined) {
        this.scoreService.getGroupedScores(this.groupId, this.raceId).subscribe(scoreJSON => {
          const scoreMap = new Map<number, Score[]>(Object.entries(scoreJSON).map(([key, value]) => [parseInt(key), value]));
          for(const [userId, scores] of scoreMap) {
            this.userDataPartialUpdate(userId, { scores });
            if(scores.length > 0) {
              this.scoreAvailable = true;
              let sum = 0;
              for(const score of scores) {
                if(score.points) {
                  sum += Number(score.points);
                }
              }
              const existingTotal = this.userId2UserData.get(userId)?.total;
              if(existingTotal !== undefined) {
                this.userDataPartialUpdate(userId, { total: sum + existingTotal });
              } else {
                this.userDataPartialUpdate(userId, { total: sum });
              }
            }
          }
          this.checkRaceStatus();
        });
      }
    }

    private getRace(): void {
      if(this.raceId === undefined) {
        const raceIdStr = localStorage.getItem('raceId');
        if(raceIdStr) {
          this.raceId = Number(raceIdStr);
        }
      }
      if(this.raceId !== undefined) {
        this.raceService.getById(this.raceId).subscribe(race => {
          this.race = race;
          if(this.race.predictionDeadline) {
            if(typeof this.race.predictionDeadline === 'string') {
              this.race.predictionDeadline = new Date(this.race.predictionDeadline);
            }
            this.updateTimeLeft(this.race.predictionDeadline);
          } else if(this.race.date) {
            if(typeof this.race.date === 'string') {
              this.race.date = new Date(this.race.date);
            }
            this.updateTimeLeft(this.race.date);
          }
        });
      }
    }

    private checkRaceStatus(): void {
      const now = new Date();
      if(this.race?.predictionDeadline && this.race?.date) {
        if(typeof this.race.date === 'string') {
          this.race.date = new Date(this.race.date);
        }
        if(typeof this.race.predictionDeadline === 'string') {
          this.race.predictionDeadline = new Date(this.race.predictionDeadline);
        }
        if(now > this.race.predictionDeadline) {
          if(now < this.race.date) {
            this.raceStatus = RaceStatus.AFTER_DEADLINE_BEFORE_RACE;
          } else {
            if(this.scoreAvailable) {
              this.raceStatus = RaceStatus.AFTER_RACE_AFTER_RESULTS;
            } else {
              this.raceStatus = RaceStatus.AFTER_RACE_BEFORE_RESULTS;
            }
          }
        } else {
          this.raceStatus = RaceStatus.BEFORE_DEADLINE;
        }
      }
      this.loading = false;
    }

    private getUsersByGroup(): void {
      if(this.groupId === undefined) {
        const groupIdStr = localStorage.getItem('groupId');
        if(groupIdStr) {
          this.groupId = Number(groupIdStr);
        }
      }
      if(this.groupId !== undefined) {
        this.groupService.getUsersByGroup(this.groupId).subscribe({
          next: (users: User[]) => {
            users.forEach(user => {
              if(user.id !== undefined) {
                this.userDataPartialUpdate(user.id, { user });
              }
            });
          }
        })
      }
    }

    private updateTimeLeft(raceDate: Date): void {
      const currentDate = new Date();
      const timeDiff = raceDate.getTime() - currentDate.getTime();
      if(timeDiff < 0) {
        this.raceFinished = true;
        return;
      }
      let timeLeftMilis = timeDiff;

      this.raceIntervalId = setInterval(() => {
        timeLeftMilis -= 1000;
        this.timeLeft = this.dateUtilService.getTimeLeft(timeLeftMilis);
        this.raceEventService.notifyAboutRaceTime(this.timeLeft);

        if (timeLeftMilis <= 0) {
          this.raceFinished = true;
          this.raceStatus = RaceStatus.AFTER_DEADLINE_BEFORE_RACE;
          this.raceEventService.notifyAboutPredictionLock();
          this.handlePredictionSaveBtnClick();
          clearInterval(this.raceIntervalId);
        }
      }, 1000);
    }

    private driverArrayToObj(): void {
      this.drivers.forEach((driver) => {
        if(driver.id !== undefined) {
          this.driverObj[driver.id] = driver;
        }
      });
    }

    private getUserId(): void {
      const userId = this.localStorageService.getUserId();
      if(userId != null) {
        this.userId = userId;
      }
    }

    private showSnackBar(msg: string): void {
      this.snackBar.open(msg, 'OK', {
        duration: 3000
      });
    }

    private updateDataArray(): void {
      this.dataArray = this.moveUserToFirst(Array.from(this.userId2UserData));
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

    private moveUserToFirst(users: DataArray): DataArray {
      const userIndex = users.findIndex(userData => userData[1].user?.id === this.userId);
      if (userIndex === -1) {
        return users;
      }
      const user = users[userIndex];
      const remainingUsers = users.filter((_, index) => index !== userIndex);
      return [user, ...remainingUsers];
    }

}
