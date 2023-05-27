import { JwtPayload } from './../../model/types/jwt-payload';
import { BASE_URL } from './../../app.constants';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, Subject } from "rxjs";
import { UserDTO } from "src/app/model/dto/user.dto";
import { User } from 'src/app/model/entities/user.model';

type JwtToken = {
  access_token: string;
  id: number;
  isAdmin: number;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  REGISTER_ROUTE = 'auth/register';
  LOGIN_ROUTE = 'auth/login';
  AUTH_ROUTE = 'auth/authenticate';
  isAuthSubject: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getAuthObs(): Observable<boolean> {
    return this.isAuthSubject.asObservable();
  }

  authenticate(): void {
    this.isAuthSubject.next(true);
  }

  isAuthenticated(): Observable<JwtPayload> {
    return this.http.get<JwtPayload>(`${BASE_URL}/${this.AUTH_ROUTE}`);
  }

  register(userDTO: UserDTO): Observable<User> {
    return this.http.post<User>(`${BASE_URL}/${this.REGISTER_ROUTE}`, userDTO);
  }

  login(userDTO: UserDTO): Observable<void> {
    return this.http.post<JwtToken>(`${BASE_URL}/${this.LOGIN_ROUTE}`, userDTO)
      .pipe(map(response => this.authenticateSuccess(response)));
  }

  logout(): Promise<void> {
    return new Promise(resolve => {
      localStorage.clear();
      resolve();
    });
  }

  private authenticateSuccess(response: JwtToken): void {
    const { access_token, id, isAdmin } = response;
    localStorage.setItem('token', access_token);
    localStorage.setItem('id', id.toString());
    localStorage.setItem('isAdmin', isAdmin.toString());
  }
}
