import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { Group } from "src/app/model/entities/group.model";

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent {

  @Input() groups?: Group[];
  @Output() leaveGroupClick: EventEmitter<number> = new EventEmitter<number>();

  constructor(private router: Router) {}

  handleGroupClick(groupId: number): void {
    this.router.navigate(['seasons'], { state: { groupId: groupId }});
  }

  handleLeaveGroupClick(groupId: number): void {
    this.leaveGroupClick.emit(groupId);
  }

}
