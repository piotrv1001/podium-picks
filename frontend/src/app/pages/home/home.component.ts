import { Component, OnInit } from "@angular/core";
import { GroupService } from "src/app/services/group.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupDialogComponent } from "src/app/components/create-group-dialog/create-group-dialog.component";
import { JoinGroupDialogComponent } from "src/app/components/join-group-dialog/join-group-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { GroupWithUserCount } from "src/app/model/types/group-with-user-count";
import { TranslateService } from "@ngx-translate/core";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  groups: GroupWithUserCount[] = [];
  userId?: number;

  constructor(
    public dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private groupService: GroupService,
    private snackBar: MatSnackBar,
    private router: Router,
    public translateService: TranslateService,
    private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.navigationService.notifyAboutInitRoute('home');
    const isAdmin = this.localStorageService.getIsAdmin();
    if(isAdmin && isAdmin === 1) {
      this.router.navigate(['seasons']);
    } else {
      this.getGroupsForUser();
    }
  }

  handleLeaveGroupClick(groupId: number): void {
    if(this.userId != null) {
      this.groupService.removeUserFromGroup(groupId, this.userId).subscribe((group) => {
        const groupIndex = this.groups.findIndex(mGroup => mGroup.id === group.id);
        if(groupIndex >= 0) {
          this.groups.splice(groupIndex, 1);
          const msg = this.translateService.instant('group.leftGroup', { groupName: group.name });
          this.showSnackBar(msg);
        }
      });
    }
  }

  openCreateGroupDialog(): void {
    const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
      data: { userId: this.userId }
    });
    dialogRef.afterClosed().subscribe((group: GroupWithUserCount) => {
      if(group) {
        this.groups.push(group);
      }
    });
  }

  openJoinGroupDialog(): void {
    const dialogRef = this.dialog.open(JoinGroupDialogComponent, {
      data: { userId: this.userId }
    });
    dialogRef.afterClosed().subscribe((group) => {
      if(group) {
        this.groups.push(group);
      }
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

  private showSnackBar(msg: string): void {
    this.snackBar.open(msg, 'OK', {
      duration: 3000
    });
  }

}
