import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Group } from 'src/app/model/entities/group.model';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-create-group-dialog',
  templateUrl: './create-group-dialog.component.html',
  styleUrls: ['./create-group-dialog.component.scss']
})
export class CreateGroupDialogComponent {

  groupName: string = '';
  groupCreated: boolean = false;
  group?: Group;

  constructor(
    public dialogRef: MatDialogRef<CreateGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private groupService: GroupService,
    private snackBar: MatSnackBar,
    public translateService: TranslateService
  ) {}

  createGroup(): void {
    this.groupService.create({name: this.groupName}, this.data.userId).subscribe((group) => {
      const msg = this.translateService.instant('group.created', { groupName: group.name });
      this.snackBar.open(msg, 'OK', {
        duration: 3000
      });
      this.group = group;
      this.groupCreated = true;
    });
  }

  closeDialog(): void {
    this.dialogRef.close({...this.group, count: 1});
  }

}
