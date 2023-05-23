import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NavItem } from '../components/navigation/navigation.component';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private routeSub: Subject<NavItem> = new Subject();
  private resetSub: Subject<void> = new Subject();
  private initRouteSub: Subject<string> = new Subject();

  getNavItemObservable(): Observable<NavItem> {
    return this.routeSub.asObservable();
  }

  getResetObservable(): Observable<void> {
    return this.resetSub.asObservable();
  }

  getInitRoutSub(): Observable<string> {
    return this.initRouteSub.asObservable();
  }

  notifyAboutNavItem(navItem: NavItem): void {
    this.routeSub.next(navItem);
  }

  notifyAboutReset(): void {
    this.resetSub.next();
  }

  notifyAboutInitRoute(url: string): void {
    this.initRouteSub.next(url);
  }

}
