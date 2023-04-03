import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Season } from '../model/entities/season.model';
import { BASE_URL } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {

  SEASON_ROUTE = 'seasons';
  private currentSeasonIdSub: Subject<number> = new Subject<number>();

  constructor(private http: HttpClient) {}

  getCurrentSeasonIdObs(): Observable<number> {
    return this.currentSeasonIdSub.asObservable();
  }

  updateCurrentSeasonId(id: number): void {
    this.currentSeasonIdSub.next(id);
  }

  getAllSeasons(): Observable<Season[]> {
    return this.http.get<Season[]>(`${BASE_URL}/${this.SEASON_ROUTE}`);
  }
}
