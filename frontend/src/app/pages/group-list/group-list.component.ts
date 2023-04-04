import { Component, Input } from "@angular/core";
import { Group } from "src/app/model/entities/group.model";

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent {

  @Input() groups?: Group[];

}
