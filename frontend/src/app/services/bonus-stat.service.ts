import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BonusStatDTO } from "../model/dto/bonus-stat.dto";
import { BonusStat } from '../model/entities/bonus-stat.model';
import { BASE_URL } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class BonusStatService {

  BONUS_STAT_ROUTE = 'bonus-stats';

  constructor(private http: HttpClient) {}

  create(bonusStatDto: BonusStatDTO): Observable<BonusStat> {
    return this.http.post<BonusStat>(`${BASE_URL}/${this.BONUS_STAT_ROUTE}`, bonusStatDto);
  }

  getByRaceGroupUser(raceId: number, groupId: number, userId: number): Observable<BonusStat[]> {
    return this.http.get<BonusStat[]>(`${BASE_URL}/${this.BONUS_STAT_ROUTE}?raceId=${raceId}&groupId=${groupId}&userId=${userId}`);
  }

  getByRaceGroup(raceId: number, groupId: number): Observable<Record<string, BonusStat[]>> {
    const url = `${BASE_URL}/${this.BONUS_STAT_ROUTE}?raceId=${raceId}&groupId=${groupId}`;
    return this.http.get<Record<string, BonusStat[]>>(url);
  }

  updateMany(bonusStatArray: BonusStat[]): Observable<BonusStat[]> {
    return this.http.put<BonusStat[]>(`${BASE_URL}/${this.BONUS_STAT_ROUTE}/updateMany`, bonusStatArray);
  }

  createMany(bonusStatDtoArray: BonusStatDTO[]): Observable<BonusStat[]> {
    return this.http.post<BonusStat[]>(`${BASE_URL}/${this.BONUS_STAT_ROUTE}/createMany`, bonusStatDtoArray);
  }

  update(bonusStat: BonusStat): Observable<BonusStat> {
    return this.http.put<BonusStat>(`${BASE_URL}/${this.BONUS_STAT_ROUTE}`, bonusStat);
  }
}
