import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFixedString'
})
export class ToFixedStringPipe implements PipeTransform {
  transform(value: number | string): string {
    if(typeof value === 'number') {
      return value.toFixed(1);
    }
    return Number(value).toFixed(1);
  }
}
