
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BASE_URL } from "../app.constants";
import { Score } from "../model/entities/score.model";
import { Stats } from "../model/types/stats";

@Injectable({
  providedIn: "root"
})
export class ScoreService {

  SCORE_ROUTE = 'scores';

  constructor(private http: HttpClient) {}

  getGroupedScores(groupId: number, raceId: number): Observable<Record<string, Score[]>> {
    const url = `${BASE_URL}/${this.SCORE_ROUTE}/races/${raceId}/groups/${groupId}`;
    return this.http.get<Record<string, Score[]>>(url);
  }

  getGrouppedTotalScores(groupId: number, seasonId: number): Observable<Record<string, Stats>> {
    const url = `${BASE_URL}/${this.SCORE_ROUTE}/${groupId}/${seasonId}/stats-by-user`;
    return this.http.get<Record<string, Stats>>(url);
  }

  getByUserGroupRace(userId: number, groupI: number, raceId: number): Observable<Score[]> {
    return this.http.get<Score[]>(`${BASE_URL}/${this.SCORE_ROUTE}?userId=${userId}&groupId=${groupI}&raceId=${raceId}`);
  }

  updateMany(scoreDtoArray: Score[]): Observable<Score[]> {
    return this.http.put<Score[]>(`${BASE_URL}/${this.SCORE_ROUTE}/updateMany`, scoreDtoArray);
  }

}
