import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Result } from "../model/entities/result.model";
import { BASE_URL } from "../app.constants";
import { ResultDTO } from "../model/dto/result.dto";

@Injectable({
  providedIn: "root"
})
export class ResultService {

  RESULT_ROUTE = 'results';

  constructor(private http: HttpClient) {}

  createMany(resultDtoArray: ResultDTO[]): Observable<Result[]> {
    return this.http.post<Result[]>(`${BASE_URL}/${this.RESULT_ROUTE}/createMany`, resultDtoArray);
  }

  updateMany(resultArray: Result[]): Observable<Result[]> {
    return this.http.put<Result[]>(`${BASE_URL}/${this.RESULT_ROUTE}/updateMany`, resultArray);
  }

  getByRaceId(raceId: number): Observable<Result[]> {
    return this.http.get<Result[]>(`${BASE_URL}/${this.RESULT_ROUTE}?raceId=${raceId}`);
  }

}
