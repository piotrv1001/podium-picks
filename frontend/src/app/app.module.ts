import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    GroupPredictionsComponent
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
    MatMenuModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
