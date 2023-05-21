import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule.forRoot(
    [
      {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then( m => m.HomeModule)
      },
      {
        path: 'seasons',
        loadChildren: () => import('./pages/season-list/season-list.module').then( m => m.SeasonListModule)
      },
      {
        path: 'races',
        loadChildren: () => import('./pages/race-list/race-list.module').then( m => m.RaceListModule)
      },
      {
        path: 'drivers',
        loadChildren: () => import('./pages/group-predictions/group-predictions.module').then( m => m.GroupPredictionsModule)
      },
      {
        path: 'results',
        loadChildren: () => import('./pages/admin/admin-race-results/admin-race-results.module').then( m => m.AdminRaceResultsModule)
      },
      {
        path: 'groups',
        loadChildren: () => import('./pages/admin/admin-groups/admin-groups.module').then( m => m.AdminGroupsModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./pages/admin/admin-users/admin-users.module').then( m => m.AdminUsersModule)
      },
      {
        path: 'points',
        loadChildren: () => import('./pages/admin/admin-points/admin-points.module').then( m => m.AdminPointsModule)
      },
    ]
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
