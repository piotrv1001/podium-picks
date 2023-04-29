import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "src/app/model/entities/user.model";
import { GroupService } from "src/app/services/group.service";

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
  ) {
    this.groupId = this.router.getCurrentNavigation()?.extras?.state?.["groupId"];
    this.raceId = this.router.getCurrentNavigation()?.extras?.state?.["raceId"];
  }

  ngOnInit(): void {
    this.getUsers();
  }

  handleUserClick(userId: number): void {
    this.router.navigate(['points'], { state: { raceId: this.raceId, groupId: this.groupId, userId: userId } });
  }

  private getUsers(): void {
    if(this.groupId != null) {
      this.groupService.getUsersByGroup(this.groupId).subscribe(users => this.users = users);
    }
  }

}
