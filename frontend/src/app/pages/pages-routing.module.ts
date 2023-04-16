import { NgModule } from "@angular/core";
import { HomeComponent } from "./home/home.component";
import { RouterModule } from '@angular/router';
import { RaceListComponent } from "./race-list/race-list.component";
import { SeasonListComponent } from "./season-list/season-list.component";
import { GroupPredictionsComponent } from "./group-predictions/group-predictions.component";
import { AdminRaceResultsComponent } from "./admin/admin-race-results/admin-race-results.component";

@NgModule({
  imports: [
  RouterModule.forChild([
    {
      path: '',
      component: HomeComponent
    },
    {
      path: 'seasons',
      component: SeasonListComponent
    },
    {
      path: 'races',
      component: RaceListComponent
    },
    {
      path: 'drivers',
      component: GroupPredictionsComponent
    },
    {
      path: 'results',
      component: AdminRaceResultsComponent
    }
  ])
]})
export class PagesRoutingModule { }
