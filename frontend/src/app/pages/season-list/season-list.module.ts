import { NgModule } from '@angular/core';
import { SeasonListComponent } from './season-list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeasonComponent } from 'src/app/components/season/season.component';
import { ProgressCircleComponent } from 'src/app/components/progress-circle/progress-circle.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: SeasonListComponent },
    ])
  ],
  declarations: [
    SeasonListComponent,
    SeasonComponent,
    ProgressCircleComponent
  ]
})
export class SeasonListModule {

}
