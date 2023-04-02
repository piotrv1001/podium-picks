import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DriverNameComponent } from './components/driver-name/driver-name.component';
import { DriverDragDropComponent } from './components/driver-drag-drop/driver-drag-drop.component';

import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    DriverNameComponent,
    DriverDragDropComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
