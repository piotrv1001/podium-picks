import { NgModule } from '@angular/core';
import { AdminUsersComponent } from './admin-users.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserComponent } from 'src/app/components/user/user.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: AdminUsersComponent },
    ])
  ],
  declarations: [
    AdminUsersComponent,
    UserComponent
  ]
})
export class AdminUsersModule {

}
