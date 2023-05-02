import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userCount'
})
export class UserCountPipe implements PipeTransform {
  transform(count: number | undefined): string {
    if(count === undefined) {
      return '0 members';
    }
    if(count === 1) {
      return `${count} member`;
    }
    return `${count} members`;
  }
}
