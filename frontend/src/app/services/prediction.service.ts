import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Prediction } from '../model/entities/prediction.model';
import { PredictionDTO } from '../model/dto/prediction.dto';
import { BASE_URL } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  PREDICTION_ROUTE = 'predictions';

  constructor(private http: HttpClient) {}

  createMany(predictionDtoArray: PredictionDTO[]): Observable<Prediction[]> {
    return this.http.post<Prediction[]>(`${BASE_URL}/${this.PREDICTION_ROUTE}/createMany`, predictionDtoArray);
  }

  updateMany(predictionArray: Prediction[]): Observable<Prediction[]> {
    return this.http.put<Prediction[]>(`${BASE_URL}/${this.PREDICTION_ROUTE}/updateMany`, predictionArray);
  }

  getByUserAndRace(userId: number, raceId: number): Observable<Prediction[]> {
    return this.http.get<Prediction[]>(`${BASE_URL}/${this.PREDICTION_ROUTE}?userId=${userId}&raceId=${raceId}`);
  }

}
