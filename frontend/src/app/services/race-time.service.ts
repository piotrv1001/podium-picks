import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CustomDate } from '../model/types/custom-date';

@Injectable({
  providedIn: 'root'
})
export class RaceTimeService {

  private raceTimeSub: Subject<CustomDate> = new Subject<CustomDate>();

  getRaceTimeObservable(): Observable<CustomDate> {
    return this.raceTimeSub.asObservable();
  }

  notifyAboutRaceTime(raceTime: CustomDate): void {
    this.raceTimeSub.next(raceTime);
  }

}
