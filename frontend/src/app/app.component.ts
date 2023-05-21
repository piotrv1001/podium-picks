import { LocalStorageService } from './services/local-storage.service';
import { JwtPayload } from './model/types/jwt-payload';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './shared/auth/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NavigationService } from './services/navigation.service';

interface Language {
  langKey: string;
  flagKey: string;
  langName: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  createNewAccount = false;
  authSub?: Subscription;
  languages: Language[] = [];
  currentLangKey: string = 'pl';
  currentFlagKey: string = 'pl';

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router,
    public translateService: TranslateService,
    private navigationService: NavigationService
    ) {
    this.languages = [
      { langKey: 'en', flagKey: 'us', langName: 'English' },
      { langKey: 'pl', flagKey: 'pl', langName: 'Polish' }
    ]
    translateService.addLangs(['en', 'pl']);
    translateService.setDefaultLang('pl');
    const storageLang = this.localStorageService.getLang();
    if(storageLang) {
      this.currentLangKey = storageLang;
      this.currentFlagKey = storageLang === 'en' ? 'us' : storageLang;
      translateService.use(storageLang);
    } else {
      const browserLang = translateService.getBrowserLang();
      const useLang = browserLang?.match(/en|pl/) ? browserLang : 'pl';
      this.currentLangKey = useLang;
      this.currentFlagKey = useLang === 'en' ? 'us' : useLang;
      translateService.use(useLang);
    }
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
      if(auth) {
        this.navigateHome();
      }
    });
  }

  changeLanguage(lang: Language): void {
    this.currentLangKey = lang.langKey;
    this.currentFlagKey = lang.flagKey;
    this.translateService.use(lang.langKey);
    this.localStorageService.setLang(lang.langKey);
  }

  navigateHome(): void {
    this.navigationService.notifyAboutReset();
    this.router.navigate(['home']);
  }

  logOut(): void {
    this.authService.logout().then(() => {
        this.isAuthenticated = false;
        this.router.navigate(['home']);
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
