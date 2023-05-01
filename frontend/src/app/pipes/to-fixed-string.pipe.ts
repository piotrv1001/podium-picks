import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFixedString'
})
export class ToFixedStringPipe implements PipeTransform {
  transform(value: number | string, fractionDigits: number = 1): string {
    if(typeof value === 'number') {
      return value.toFixed(fractionDigits);
    }
    return Number(value).toFixed(fractionDigits);
  }
}
