import { Component, Input, OnInit } from "@angular/core";
import { CustomDate } from "src/app/model/types/custom-date";
import { RaceTimeService } from "src/app/services/race-time.service";

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss']
})
export class CountdownTimerComponent implements OnInit {

  formattedTime?: CustomDate;
  loading: boolean = true;

  constructor(
    private raceTimeService: RaceTimeService
  ) { }

  ngOnInit(): void {
    this.raceTimeService.getRaceTimeObservable().subscribe(time => {
      this.formattedTime = this.getFormattedTime(time);
      this.loading = false;
    });
  }

  private getFormattedTime(time: CustomDate): CustomDate {
    let { days, hours, minutes, seconds } = time;
    hours = this.padZeros(hours.toString());
    minutes = this.padZeros(minutes.toString());
    seconds = this.padZeros(seconds.toString());
    return {
      days,
      hours,
      minutes,
      seconds
    }
  }

  private padZeros(str: string): string {
    return str.padStart(2, '0');
  }

}
