import { Component, OnInit } from "@angular/core";
import { Group } from "src/app/model/entities/group.model";
import { GroupService } from "src/app/services/group.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupDialogComponent } from "src/app/components/create-group-dialog/create-group-dialog.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  groups: Group[] = [];
  userId?: number;

  constructor(
    private localStorageService: LocalStorageService,
    private groupService: GroupService,
    public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getGroupsForUser();
  }

  openCreateGroupDialog(): void {
    const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
      data: { userId: this.userId }
    });
    dialogRef.afterClosed().subscribe((group) => {
      this.groups.push(group);
    });
  }

  private getGroupsForUser(): void {
    const userId = this.localStorageService.getUserId();
    if(userId) {
      this.userId = userId;
      this.groupService.getGroupsForUser(userId).subscribe(groups => {
        this.groups = groups;
      });
    }
  }

}
