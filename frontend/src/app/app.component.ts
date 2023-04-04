import { LocalStorageService } from './services/local-storage.service';
import { JwtPayload } from './model/types/jwt-payload';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './shared/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  createNewAccount = false;
  authSub?: Subscription;

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe({
      next: (payload: JwtPayload) => {
        this.localStorageService.saveUserId(payload.id);
        this.isAuthenticated = true;
      },
      error: (error) => {
        this.isAuthenticated = false;
        console.log(error)
      }
    });
    this.authSub = this.authService.getAuthObs().subscribe(auth => {
      this.isAuthenticated = auth;
    });
  }

  logOut(): void {
    this.authService.logout().then(() => {
        this.isAuthenticated = false;
        this.router.navigate(['/']);
      }
    );
  }

  handleRegisterBtnClick(): void {
    this.createNewAccount = true;
  }

  handleLoginBtnClick(): void {
    this.createNewAccount = false;
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

}
