import { Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { NavigationService } from "src/app/services/navigation.service";

export interface NavItem {
  url: string;
  name: string;
  navExtras?: NavigationExtras;
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  routes: NavItem[] = [];

  constructor(
    public router: Router,
    private navigationService: NavigationService
    ) {}

    ngOnInit(): void {
      this.initializeRoutes();
      this.getNavItems();
    }

    private initializeRoutes(): void {
      this.routes = [];
      const initialRoute: NavItem = {
        url: '/',
        name: 'Home'
      };
      this.routes.push(initialRoute);
    }

    navigateToNavItem(index: number): void {
      const navItem = this.routes[index];
      this.routes = this.routes.slice(0, index + 1);
      this.router.navigate([navItem.url], navItem.navExtras);
    }

    private getNavItems(): void {
      this.navigationService.getNavItemObservable().subscribe(navItem => {
        this.routes.push(navItem);
      });
      this.navigationService.getResetObservable().subscribe(() => {
        this.initializeRoutes();
      });
    }

}
