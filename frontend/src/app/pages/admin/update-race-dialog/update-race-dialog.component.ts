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
  raceDate: Date | null = null;
  raceDateDeadline: Date | null = null;
  startAt: Date = new Date();
  startAtDeadline: Date = new Date();
  deadlineHours: number = 0;
  deadlineMinutes: number = 0;
  raceHours: number = 0;
  raceMinutes: number = 0;

  constructor(
    private raceService: RaceService,
    public dialogRef: MatDialogRef<UpdateRaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { raceId: number }
  ) {}

  ngOnInit(): void {
    this.getRaceById(this.data.raceId);
  }

  onSubmit(): void {
    if(this.race && this.raceDate && this.raceDateDeadline) {
      this.race.date = this.raceDate;
      this.race.predictionDeadline = this.raceDateDeadline;
      this.raceService.update(this.race).subscribe({
        next: (updatedRace: Race) => {
          this.dialogRef.close(updatedRace);
        }
      });
    }
  }

  onDeadlineHoursChange(hours: number): void {
    this.raceDateDeadline?.setHours(hours);
  }

  onDeadlineMinutesChange(minutes: number): void {
    this.raceDateDeadline?.setMinutes(minutes);
  }

  onRaceHoursChange(hours: number): void {
    this.raceDate?.setHours(hours);
  }

  onRaceMinutesChange(minutes: number): void {
    this.raceDate?.setMinutes(minutes);
  }

  onCancelBtnClick(): void {
    this.dialogRef.close();
  }

  private getRaceById(id: number): void {
    this.raceService.getById(id).subscribe(race => {
      this.race = race;
      const parsedDate = this.parseDate(this.race.date);
      if(parsedDate) {
        this.raceDate = parsedDate;
        this.raceHours = this.raceDate.getHours();
        this.raceMinutes = this.raceDate.getMinutes();
        this.startAt.setMonth(this.raceDate.getMonth());
      }
      const parsedDateDeadline = this.parseDate(this.race.predictionDeadline);
      if(parsedDateDeadline) {
        this.raceDateDeadline = parsedDateDeadline;
        this.deadlineHours = this.raceDateDeadline.getHours();
        this.deadlineMinutes = this.raceDateDeadline.getMinutes();
        this.startAtDeadline.setMonth(this.raceDateDeadline.getMonth());
      }
    });
  }

  private parseDate(date?: Date | string): Date | undefined {
    if(date) {
      if(typeof date === 'string') {
        date = new Date(date);
      }
      return date;
    }
    return undefined;
  }

}
