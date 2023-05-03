import { Component, Input, HostBinding, OnInit } from "@angular/core";

@Component({
  selector: 'app-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.scss']
})
export class ProgressCircleComponent implements OnInit {

  @Input() progress?: number = 0;
  @Input() total?: number = 0;
  @HostBinding('style.--offset')
  private offset: string = '450';

  ngOnInit(): void {
    if(this.progress && this.total) {
      this.offset = (450 - ((this.progress / this.total) * 450)).toString();
    } else {
      this.offset = '450';
    }
  }
}
