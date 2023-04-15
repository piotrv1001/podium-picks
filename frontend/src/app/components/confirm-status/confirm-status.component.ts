import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-status',
  templateUrl: './confirm-status.component.html',
  styleUrls: ['./confirm-status.component.scss']
})
export class ConfirmStatusComponent {

  @Input() confirmText?: string;
  @Input() confirmed: boolean = false;

}
