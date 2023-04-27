import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Group } from "src/app/model/entities/group.model";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.compnent";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent {

  @Input() group?: Group;
  @Input() isAdmin?: boolean = false;
  @Output() groupClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() leaveGroupClick: EventEmitter<number> = new EventEmitter<number>();

  constructor(public dialog: MatDialog) { }

  groupClicked(): void {
    if(this.group?.id) {
      this.groupClick.emit(this.group.id);
    }
  }

  leaveGroupBtnClicked(): void {
    if(this.group?.id) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Leave Group',
          message: `Are you sure you want to leave the group: ${this.group.name}?`,
          okText: 'Leave',
          cancelText: 'Cancel'
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
