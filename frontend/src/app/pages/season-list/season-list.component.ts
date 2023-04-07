import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Season } from "src/app/model/entities/season.model";
import { SeasonService } from "src/app/services/season.service";

@Component({
  selector: 'app-season-list',
  templateUrl: './season-list.component.html',
  styleUrls: ['./season-list.component.scss']
})
export class SeasonListComponent implements OnInit {

  seasons: Season[] = [];
  groupId?: number;

  constructor(
    private seasonService: SeasonService,
    private router: Router) {
      this.groupId = this.router.getCurrentNavigation()?.extras?.state?.["groupId"];
    }

  ngOnInit(): void {
    this.getAllSeasons();
  }

  handleSeasonClick(season: Season): void {
    setTimeout(() => {
      if(season.id) {
        this.seasonService.updateCurrentSeasonId(season.id);
      }
    }, 0);
    this.router.navigate(['races'], { state: { groupId: this.groupId } });
  }

  private getAllSeasons(): void {
    this.seasonService.getAllSeasons().subscribe({
      next: (seasons) => {
        this.seasons = seasons;
      }
    });
  }
}
