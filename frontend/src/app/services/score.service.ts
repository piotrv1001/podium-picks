import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BASE_URL } from "../app.constants";
import { Score } from "../model/entities/score.model";

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

}
