import { Component, Input, Output, EventEmitter } from "@angular/core";
import { User } from "src/app/model/entities/user.model";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  @Input() user?: User;
  @Output() userClick: EventEmitter<number> = new EventEmitter<number>();

  userClicked(): void {
    if(this.user?.id != null) {
      this.userClick.emit(this.user.id);
    }
  }

}
