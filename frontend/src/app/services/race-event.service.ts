import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CustomDate } from '../model/types/custom-date';

@Injectable({
  providedIn: 'root'
})
export class RaceEventService {

  private raceTimeSub: Subject<CustomDate> = new Subject<CustomDate>();
  private madeChangesSub: Subject<boolean> = new Subject<boolean>();
  private timeLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  getRaceTimeObservable(): Observable<CustomDate> {
    return this.raceTimeSub.asObservable();
  }

  getMadeChangesObservable(): Observable<boolean> {
    return this.madeChangesSub.asObservable();
  }

  getTimeLoadingObservable(): Observable<boolean> {
    return this.timeLoading.asObservable();
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

}
