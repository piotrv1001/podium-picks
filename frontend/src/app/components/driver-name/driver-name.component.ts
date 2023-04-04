import { Component, ElementRef, Input, Renderer2 } from "@angular/core";
import { Driver } from "src/app/model/entities/driver.model";

@Component({
  selector: 'app-driver-name',
  templateUrl: './driver-name.component.html',
  styleUrls: ['./driver-name.component.scss']
})
export class DriverNameComponent {

  @Input() driver?: Driver;

  get firstName(): string {
    return this.driver?.name?.split(' ')[0] ?? '';
  }

  get lastName(): string {
    return this.getSubstringAfterFirstSpace(this.driver?.name);
  }

  private getSubstringAfterFirstSpace(str?: string): string {
    if(!str) return '';
    const firstSpaceIndex = str.indexOf(' ');
    if (firstSpaceIndex === -1) {
      return str;
    }
    return str.substring(firstSpaceIndex + 1);
  }

}
