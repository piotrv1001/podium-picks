import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeString'
})
export class TimeStringPipe implements PipeTransform {
  transform(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
