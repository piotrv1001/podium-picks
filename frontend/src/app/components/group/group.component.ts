import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.compnent";
import { GroupWithUserCount } from "src/app/model/types/group-with-user-count";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent {

  @Input() group?: GroupWithUserCount;
  @Input() isAdmin?: boolean = false;
  @Output() groupClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() leaveGroupClick: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    public dialog: MatDialog,
    public translateService: TranslateService) { }

  groupClicked(): void {
    if(this.group?.id) {
      this.groupClick.emit(this.group.id);
    }
  }

  leaveGroupBtnClicked(): void {
    if(this.group?.id) {
      const title = this.translateService.instant('group.leaveDialog.title');
      const message = this.translateService.instant('group.leaveDialog.message', { groupName: this.group.name });
      const okText = this.translateService.instant('group.leaveDialog.okText');
      const cancelText = this.translateService.instant('group.leaveDialog.cancelText');
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title,
          message,
          okText,
          cancelText
        }
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if(result) {
          this.leaveGroupClick.emit(this.group?.id);
        }
      });
    }
  }

}
