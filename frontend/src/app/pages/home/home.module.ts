import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { GroupListComponent } from '../group-list/group-list.component';
import { CreateGroupDialogComponent } from 'src/app/components/create-group-dialog/create-group-dialog.component';
import { JoinGroupDialogComponent } from 'src/app/components/join-group-dialog/join-group-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: HomeComponent },
    ])
  ],
  declarations: [
    HomeComponent,
    GroupListComponent,
    CreateGroupDialogComponent,
    JoinGroupDialogComponent
  ]
})
export class HomeModule {

}
