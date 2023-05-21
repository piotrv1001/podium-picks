import { NgModule } from '@angular/core';
import { AdminRaceResultsComponent } from './admin-race-results.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: AdminRaceResultsComponent },
    ])
  ],
  declarations: [
    AdminRaceResultsComponent
  ]
})
export class AdminRaceResultsModule {

}
