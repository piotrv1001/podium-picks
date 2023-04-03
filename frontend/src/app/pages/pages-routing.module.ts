import { NgModule } from "@angular/core";
import { HomeComponent } from "./home/home.component";
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
  RouterModule.forChild([
    {
      path: '',
      component: HomeComponent
    }
  ])
]})
export class PagesRoutingModule { }
