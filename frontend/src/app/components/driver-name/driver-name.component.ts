import { Component, Input } from "@angular/core";
import { Driver } from "src/app/model/entities/driver.model";

@Component({
  selector: 'app-driver-name',
  templateUrl: './driver-name.component.html',
  styleUrls: ['./driver-name.component.scss']
})
export class DriverNameComponent {

  @Input() driver?: Driver;
  @Input() showDragIcon: boolean = true;
  @Input() points?: number;

}
