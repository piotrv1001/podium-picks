import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Race } from '../model/entities/race.model';
import { BASE_URL } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class RaceService {

  RACE_ROUTE = 'races';

  constructor(private http: HttpClient) {}

  getById(raceId: number): Observable<Race> {
    return this.http.get<Race>(`${BASE_URL}/${this.RACE_ROUTE}/${raceId}`);
  }

  getByIdWithFLandDNF(raceId: number): Observable<Race> {
    return this.http.get<Race>(`${BASE_URL}/${this.RACE_ROUTE}/${raceId}/fl-dnf`);
  }

  getAllRacesForSeason(seasonId: number): Observable<Race[]> {
    return this.http.get<Race[]>(`${BASE_URL}/${this.RACE_ROUTE}?seasonId=${seasonId}`);
  }

  update(race: Race): Observable<Race> {
    return this.http.put<Race>(`${BASE_URL}/${this.RACE_ROUTE}`, race);
  }

  assignFastestLap(raceId: number, driverId: number): Observable<Race> {
    return this.http.patch<Race>(`${BASE_URL}/${this.RACE_ROUTE}/fastest-lap/${raceId}/${driverId}`, {});
  }

  assignDnfDrivers(raceId: number, dnfDrivers: number[]): Observable<Race> {
    return this.http.patch<Race>(`${BASE_URL}/${this.RACE_ROUTE}/dnf/${raceId}`, dnfDrivers);
  }
}
