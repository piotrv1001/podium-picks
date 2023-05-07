import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CustomDate } from '../model/types/custom-date';
import { Driver } from '../model/entities/driver.model';

@Injectable({
  providedIn: 'root'
})
export class RaceEventService {

  private raceTimeSub: Subject<CustomDate> = new Subject<CustomDate>();
  private madeChangesSub: Subject<boolean> = new Subject<boolean>();
  private timeLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private drivers: Driver[] = [];
  private predictionLockSub: Subject<void> = new Subject<void>();

  getRaceTimeObservable(): Observable<CustomDate> {
    return this.raceTimeSub.asObservable();
  }

  getMadeChangesObservable(): Observable<boolean> {
    return this.madeChangesSub.asObservable();
  }

  getTimeLoadingObservable(): Observable<boolean> {
    return this.timeLoading.asObservable();
  }

  getPredictionLockObservabvle(): Observable<void> {
    return this.predictionLockSub.asObservable();
  }

  notifyAboutRaceTime(raceTime: CustomDate): void {
    this.raceTimeSub.next(raceTime);
  }

  notifyAboutMadeChanges(madeChanges: boolean): void {
    this.madeChangesSub.next(madeChanges);
  }

  notifyAboutTimeLoading(timeLoading: boolean): void {
    this.timeLoading.next(timeLoading);
  }

  notifyAboutPredictionLock(): void {
    this.predictionLockSub.next();
  }

  getDrivers(): Driver[] {
    return this.drivers;
  }

  setDrivers(drivers: Driver[]): void {
    this.drivers = drivers;
  }

}
