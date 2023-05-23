import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { GroupWithUserCount } from "src/app/model/types/group-with-user-count";
import { GroupService } from "src/app/services/group.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
  selector: 'app-admin-groups',
  templateUrl: './admin-groups.component.html',
  styleUrls: ['./admin-groups.component.scss']
})
export class AdminGroupsComponent implements OnInit {

  groups: GroupWithUserCount[] = [];
  filteredGroups: GroupWithUserCount[] = [];
  raceId?: number;
  query: string = '';

  constructor(
    private groupService: GroupService,
    private router: Router,
    private navigationService: NavigationService,
    public translateService: TranslateService) {
      this.raceId = this.router.getCurrentNavigation()?.extras?.state?.["raceId"];
    }

  ngOnInit(): void {
    this.navigationService.notifyAboutInitRoute('groups');
    this.getGroups();
  }

  onSearchQueryChange(query: string): void {
    if(query.length > 2) {
      this.filteredGroups = this.groups.filter(group => group.name?.toLowerCase()?.includes(query.toLowerCase()))
    } else {
      this.resetGroups();
    }
  }

  resetSearch(): void {
    this.query = '';
    this.resetGroups();
  }

  handleGroupClick(groupId: number): void {
    const navExtras = { state: { raceId: this.raceId, groupId: groupId } };
    const name = this.translateService.instant('navigation.users');
      const navItem = {
        url: 'users',
        name,
        translateName: 'users',
        navExtras
      };
      this.navigationService.notifyAboutNavItem(navItem);
    this.router.navigate(['users'], navExtras);
  }

  private getGroups(): void {
    this.groupService.getAll().subscribe(groups => {
      this.groups = groups
      this.filteredGroups = [...this.groups];
    });
  }

  private resetGroups(): void {
    this.filteredGroups = [...this.groups];
  }

}
