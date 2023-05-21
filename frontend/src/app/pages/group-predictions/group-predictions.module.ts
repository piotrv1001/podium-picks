import { NgModule } from '@angular/core';
import { GroupPredictionsComponent } from './group-predictions.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CountdownTimerComponent } from 'src/app/components/countdown-timer/countdown-timer.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: GroupPredictionsComponent },
    ])
  ],
  declarations: [
    GroupPredictionsComponent,
    CountdownTimerComponent
  ]
})
export class GroupPredictionsModule {

}
