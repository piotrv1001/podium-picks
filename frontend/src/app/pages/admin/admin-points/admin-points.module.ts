import { NgModule } from '@angular/core';
import { AdminPointsComponent } from './admin-points.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: AdminPointsComponent },
    ])
  ],
  declarations: [
    AdminPointsComponent
  ]
})
export class AdminPointsModule {

}
