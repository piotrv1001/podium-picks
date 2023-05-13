import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value?: string, len: number = 20): string {
    if(!value) return '';
    if (value.length <= len) {
      return value;
    } else {
      return value.slice(0, len) + '...';
    }
  }
}
