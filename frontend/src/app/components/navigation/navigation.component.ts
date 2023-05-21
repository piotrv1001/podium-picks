import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { NavigationService } from "src/app/services/navigation.service";

export interface NavItem {
  url: string;
  name: string;
  translateName: string;
  navExtras?: NavigationExtras;
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {

  routes: NavItem[] = [];

  constructor(
    public router: Router,
    private navigationService: NavigationService,
    public translateService: TranslateService
    ) {}

    ngOnInit(): void {
      this.getRoutesAfterRefresh();
      if(this.routes.length === 0) {
        this.initializeRoutes();
      }
      this.getNavItems();
    }

    ngOnDestroy(): void {
      this.routes = [];
      localStorage.removeItem('routes');
    }

    private initializeRoutes(): void {
      this.routes = [];
      const name = this.translateService.instant('navigation.home');
      const initialRoute: NavItem = {
        url: 'home',
        name,
        translateName: 'home'
      };
      this.routes.push(initialRoute);
      this.updateStorageRoutes();
    }

    navigateToNavItem(index: number): void {
      const navItem = this.routes[index];
      this.routes = this.routes.slice(0, index + 1);
      this.updateStorageRoutes();
      this.router.navigate([navItem.url], navItem.navExtras);
    }

    private getNavItems(): void {
      this.navigationService.getNavItemObservable().subscribe(navItem => {
        this.routes.push(navItem);
        this.updateStorageRoutes();
      });
      this.navigationService.getResetObservable().subscribe(() => {
        this.initializeRoutes();
      });
    }

    private getRoutesAfterRefresh(): void {
      const routesFromStorage = localStorage.getItem('routes');
      if(routesFromStorage !== null) {
        try {
          this.routes = JSON.parse(routesFromStorage);
        } catch(error) {
          console.log(error);
        }
      }
    }

    private updateStorageRoutes(): void {
      try {
        const routeString = JSON.stringify(this.routes);
        localStorage.setItem('routes', routeString);
      } catch(error) {
        console.log(error);
      }
    }

}
