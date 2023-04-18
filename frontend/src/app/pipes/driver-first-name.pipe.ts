import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'driverFirstName'})
export class DriverFirstNamePipe implements PipeTransform {
  transform(str?: string): string {
    return str?.split(' ')[0] ?? '';
  }
}
