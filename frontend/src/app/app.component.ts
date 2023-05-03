import { LocalStorageService } from './services/local-storage.service';
import { JwtPayload } from './model/types/jwt-payload';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './shared/auth/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
    private router: Router,
    public translateService: TranslateService
    ) {
      translateService.addLangs(['en', 'pl']);
      translateService.setDefaultLang('pl');

      const browserLang = translateService.getBrowserLang();
      translateService.use(browserLang?.match(/en|pl/) ? browserLang : 'pl');
    }

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

  navigateHome(): void {
    this.router.navigate(['/']);
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
