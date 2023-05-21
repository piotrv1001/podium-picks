import { NgModule } from '@angular/core';
import { AdminGroupsComponent } from './admin-groups.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: AdminGroupsComponent },
    ])
  ],
  declarations: [
    AdminGroupsComponent
  ]
})
export class AdminGroupsModule {

}
