import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NavItem } from '../components/navigation/navigation.component';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private routeSub: Subject<NavItem> = new Subject();
  private resetSub: Subject<void> = new Subject();

  getNavItemObservable(): Observable<NavItem> {
    return this.routeSub.asObservable();
  }

  getResetObservable(): Observable<void> {
    return this.resetSub.asObservable();
  }

  notifyAboutNavItem(navItem: NavItem): void {
    this.routeSub.next(navItem);
  }

  notifyAboutReset(): void {
    this.resetSub.next();
  }

}
