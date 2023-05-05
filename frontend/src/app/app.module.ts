import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DriverNameComponent } from './components/driver-name/driver-name.component';
import { DriverDragDropComponent } from './components/driver-drag-drop/driver-drag-drop.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { httpInterceptorProviders } from './shared/interceptors';
import { HomeComponent } from './pages/home/home.component';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SeasonListComponent } from './pages/season-list/season-list.component';
import { SeasonComponent } from './components/season/season.component';
import { RaceListComponent } from './pages/race-list/race-list.component';
import { RaceComponent } from './components/race/race.component';
import { GroupListComponent } from './pages/group-list/group-list.component';
import { GroupComponent } from './components/group/group.component';
import { CreateGroupDialogComponent } from './components/create-group-dialog/create-group-dialog.component';
import { JoinGroupDialogComponent } from './components/join-group-dialog/join-group-dialog.component';
import { CopyCodeComponent } from './components/copy-code/copy-code.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.compnent';
import { GroupPredictionsComponent } from './pages/group-predictions/group-predictions.component';
import { CountdownTimerComponent } from './components/countdown-timer/countdown-timer.component';
import { AdminRaceResultsComponent } from './pages/admin/admin-race-results/admin-race-results.component';
import { UpdateRaceDialogComponent } from './pages/admin/update-race-dialog/update-race-dialog.component';
import { DriverLastNamePipe } from './pipes/driver-last-name.pipe';
import { DriverFirstNamePipe } from './pipes/driver-first-name.pipe';
import { MatNativeDateModule } from '@angular/material/core';
import { AdminGroupsComponent } from './pages/admin/admin-groups/admin-groups.component';
import { AdminUsersComponent } from './pages/admin/admin-users/admin-users.component';
import { UserComponent } from './components/user/user.component';
import { AdminPointsComponent } from './pages/admin/admin-points/admin-points.component';
import { ToFixedStringPipe } from './pipes/to-fixed-string.pipe';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { TimeStringPipe } from './pipes/time-string.pipe';
import { ProgressCircleComponent } from './components/progress-circle/progress-circle.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DriverNameComponent,
    DriverDragDropComponent,
    SeasonListComponent,
    SeasonComponent,
    RaceListComponent,
    RaceComponent,
    GroupListComponent,
    GroupComponent,
    CreateGroupDialogComponent,
    JoinGroupDialogComponent,
    CopyCodeComponent,
    ConfirmationDialogComponent,
    GroupPredictionsComponent,
    CountdownTimerComponent,
    AdminRaceResultsComponent,
    UpdateRaceDialogComponent,
    DriverFirstNamePipe,
    DriverLastNamePipe,
    ToFixedStringPipe,
    AdminGroupsComponent,
    AdminUsersComponent,
    UserComponent,
    AdminPointsComponent,
    TimePickerComponent,
    TimeStringPipe,
    ProgressCircleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    ClipboardModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatCardModule,
    MatNativeDateModule,
    MatTabsModule,
    MatTooltipModule,
    MatSelectModule,
    MatCheckboxModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [httpInterceptorProviders, MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
