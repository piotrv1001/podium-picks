import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Race } from "src/app/model/entities/race.model";
import { RaceService } from "src/app/services/race.service";

@Component({
  selector: 'app-update-race-dialog',
  templateUrl: './update-race-dialog.component.html',
  styleUrls: ['./update-race-dialog.component.scss']
})
export class UpdateRaceDialogComponent implements OnInit {

  race?: Race;

  constructor(
    private raceService: RaceService,
    public dialogRef: MatDialogRef<UpdateRaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { raceId: number }
  ) {}

  ngOnInit(): void {
    this.getRaceById(this.data.raceId);
  }

  onSubmit(): void {
    if(this.race) {
      this.raceService.update(this.race).subscribe({
        next: (updatedRace: Race) => {
          this.dialogRef.close(updatedRace);
        }
      });
    }
  }

  onCancelBtnClick(): void {
    this.dialogRef.close();
  }

  private getRaceById(id: number): void {
    this.raceService.getById(id).subscribe(race => {
      this.race = race;
    });
  }

}
