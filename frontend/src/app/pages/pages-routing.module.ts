import { NgModule } from "@angular/core";
import { HomeComponent } from "./home/home.component";
import { RouterModule } from '@angular/router';
import { RaceListComponent } from "./race-list/race-list.component";

@NgModule({
  imports: [
  RouterModule.forChild([
    {
      path: '',
      component: HomeComponent
    },
    {
      path: 'races',
      component: RaceListComponent
    }
  ])
]})
export class PagesRoutingModule { }
