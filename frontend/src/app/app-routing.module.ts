import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule.forRoot(
    [
      {
        path: '',
        loadChildren: () => import('./pages/pages-routing.module').then( m => m.PagesRoutingModule)
      }
    ]
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
