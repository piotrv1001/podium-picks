import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-create-group-dialog',
  templateUrl: './create-group-dialog.component.html',
  styleUrls: ['./create-group-dialog.component.scss']
})
export class CreateGroupDialogComponent {

  groupName: string = '';

  constructor(
    public dialogRef: MatDialogRef<CreateGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private groupService: GroupService
  ) {}

  createGroup(): void {
    this.groupService.create({name: this.groupName}, this.data.userId).subscribe((group) => {
      this.dialogRef.close(group);
    });
  }

}
