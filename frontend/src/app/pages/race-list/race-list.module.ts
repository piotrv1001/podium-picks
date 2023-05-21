import { NgModule } from '@angular/core';
import { RaceListComponent } from './race-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { RaceComponent } from 'src/app/components/race/race.component';
import { UpdateRaceDialogComponent } from '../admin/update-race-dialog/update-race-dialog.component';
import { TimePickerComponent } from 'src/app/components/time-picker/time-picker.component';
import { TimeStringPipe } from 'src/app/pipes/time-string.pipe';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: RaceListComponent },
    ])
  ],
  declarations: [
    RaceListComponent,
    RaceComponent,
    UpdateRaceDialogComponent,
    TimePickerComponent,
    TimeStringPipe
  ]
})
export class RaceListModule {

}
