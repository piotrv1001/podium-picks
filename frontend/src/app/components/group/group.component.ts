import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Group } from "src/app/model/entities/group.model";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent {

  @Input() group?: Group;
  @Output() groupClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() leaveGroupClick: EventEmitter<number> = new EventEmitter<number>();

  groupClicked(): void {
    if(this.group?.id) {
      this.groupClick.emit(this.group.id);
    }
  }

  leaveGroupBtnClicked(): void {
    if(this.group?.id) {
      this.leaveGroupClick.emit(this.group.id);
    }
  }

}
