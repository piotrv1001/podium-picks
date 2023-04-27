import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Group } from "src/app/model/entities/group.model";
import { GroupService } from "src/app/services/group.service";

@Component({
  selector: 'app-admin-groups',
  templateUrl: './admin-groups.component.html',
  styleUrls: ['./admin-groups.component.scss']
})
export class AdminGroupsComponent implements OnInit {

  groups: Group[] = [];
  raceId?: number;

  constructor(
    private groupService: GroupService,
    private router: Router) {
      this.raceId = this.router.getCurrentNavigation()?.extras?.state?.["raceId"];
    }

  ngOnInit(): void {
    this.getGroups();
  }

  handleGroupClick(groupId: number): void {
    this.router.navigate(['users'], { state: { raceId: this.raceId, groupId: groupId } });
  }

  private getGroups(): void {
    this.groupService.getAll().subscribe(groups => this.groups = groups);
  }

}
