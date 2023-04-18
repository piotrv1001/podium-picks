import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'driverLastName'})
export class DriverLastNamePipe implements PipeTransform {
  transform(str?: string): string {
    if(!str) return '';
    const firstSpaceIndex = str.indexOf(' ');
    if (firstSpaceIndex === -1) {
      return str;
    }
    return str.substring(firstSpaceIndex + 1);
  }
}
