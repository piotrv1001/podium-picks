import { Injectable } from "@angular/core";
import { CustomDate } from "src/app/model/types/custom-date";

@Injectable({
  providedIn: 'root'
})
export class DateUtilService {

  getTimeLeft(timeLeft: number): CustomDate {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return this.ensurePositiveValues({ days, hours, minutes, seconds });
  }

  private ensurePositiveValues(customDate: CustomDate): CustomDate {
    let { days, hours, minutes, seconds } = customDate;
    return {
      days: this.positive(days),
      hours: this.positive(hours),
      minutes: this.positive(minutes),
      seconds: this.positive(seconds)
    };
  }

  private positive(val: number | string): number {
    if(typeof val === 'string') {
      val = parseInt(val);
    }
    return val < 0 ? 0 : val;
  }

}
