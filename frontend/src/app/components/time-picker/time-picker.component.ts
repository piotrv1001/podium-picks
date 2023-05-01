import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent {

  @Input() hours: number = 0;
  @Input() minutes: number = 0;
  @Output() hoursChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() minutesChange: EventEmitter<number> = new EventEmitter<number>();
  hoursIntervalId?: any;
  minutesIntervalId?: any;

  onHoursMouseDown(event: Event, increment: boolean): void {
    this.hoursIntervalId = setInterval(() => {
      this.changeHours(event, increment);
    }, 100);
  }

  onHoursMouseUp(event: Event): void {
    event.preventDefault();
    if(this.hoursIntervalId !== undefined) {
      clearInterval(this.hoursIntervalId);
    }
  }

  onMinutesMouseDown(event: Event, increment: boolean): void {
    this.minutesIntervalId = setInterval(() => {
      this.changeMinutes(event, increment);
    }, 100);
  }

  onMinutesMouseUp(event: Event): void {
    event.preventDefault();
    if(this.minutesIntervalId !== undefined) {
      clearInterval(this.minutesIntervalId);
    }
  }

  changeHours(event: Event, increment: boolean): void {
    event.preventDefault();
    this.hours += increment ? 1 : -1;
    if(this.hours < 0) {
      this.hours = 23;
    }
    this.hours = this.hours % 24;
    this.hoursChange.emit(this.hours);
  }

  changeMinutes(event: Event, increment: boolean): void {
    event.preventDefault();
    this.minutes += increment ? 1 : -1;
    if(this.minutes < 0) {
      this.minutes = 59;
    }
    this.minutes = this.minutes % 60;
    this.minutesChange.emit(this.minutes);
  }

}
