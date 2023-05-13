import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Group } from "src/app/model/entities/group.model";
import { GroupWithUserCount } from "src/app/model/types/group-with-user-count";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent {

  @Input() groups?: GroupWithUserCount[];
  @Output() leaveGroupClick: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    public translateService: TranslateService) {}

  handleGroupClick(groupId: number): void {
    const navExtras = { state: { groupId: groupId }};
    const name = this.translateService.instant('navigation.seasons');
    const navItem = {
      url: 'seasons',
      name,
      navExtras
    };
    this.navigationService.notifyAboutNavItem(navItem);
    this.router.navigate(['seasons'], navExtras);
  }

  handleLeaveGroupClick(groupId: number): void {
    this.leaveGroupClick.emit(groupId);
  }

}
