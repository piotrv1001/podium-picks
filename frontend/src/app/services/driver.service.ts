import { Injectable } from "@angular/core";
import { BASE_URL } from "../app.constants";
import { Driver } from "../model/entities/driver.model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  DRIVER_ROUTE = 'drivers';

  constructor(private http: HttpClient) {}

  getAllDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${BASE_URL}/${this.DRIVER_ROUTE}`);
  }

}
