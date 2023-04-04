import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from "@angular/material/snack-bar";
import { GroupService } from "src/app/services/group.service";

@Component({
  selector: 'app-join-group-dialog',
  templateUrl: './join-group-dialog.component.html',
  styleUrls: ['./join-group-dialog.component.scss']
})
export class JoinGroupDialogComponent {

  code: string = '';
  isCodeValid: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<JoinGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private groupService: GroupService,
    private snackBar: MatSnackBar
  ) {}

  validateCode(): void {
    this.groupService.getGroupByCode(this.code, this.data.userId).subscribe({
      next: (group) => {
        this.isCodeValid = true;
        this.snackBar.open(`Welcome to ${group?.name}!`, undefined, {
          duration: 3000
        });
        this.dialogRef.close(group);
      },
      error: () => {
        this.isCodeValid = false;
      }
    })
  }

}
