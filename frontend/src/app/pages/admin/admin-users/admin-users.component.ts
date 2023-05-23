import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { User } from "src/app/model/entities/user.model";
import { GroupService } from "src/app/services/group.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit {

  users: User[] = [];
  groupId?: number;
  raceId?: number;

  constructor(
    private router: Router,
    private groupService: GroupService,
    private navigationService: NavigationService,
    public translateService: TranslateService
  ) {
    this.groupId = this.router.getCurrentNavigation()?.extras?.state?.["groupId"];
    this.raceId = this.router.getCurrentNavigation()?.extras?.state?.["raceId"];
  }

  ngOnInit(): void {
    this.navigationService.notifyAboutInitRoute('users');
    this.getUsers();
  }

  handleUserClick(userId: number): void {
    const navExtras = { state: { raceId: this.raceId, groupId: this.groupId, userId: userId } };
    const name = this.translateService.instant('navigation.points');
      const navItem = {
        url: 'points',
        name,
        translateName: 'points',
        navExtras
      };
      this.navigationService.notifyAboutNavItem(navItem);
    this.router.navigate(['points'], navExtras);
  }

  private getUsers(): void {
    if(this.groupId != null) {
      this.groupService.getUsersByGroup(this.groupId).subscribe(users => this.users = users);
    }
  }

}
