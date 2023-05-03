import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SeasonWithProgress } from "src/app/model/types/season-with-progress";
import { SeasonService } from "src/app/services/season.service";

@Component({
  selector: 'app-season-list',
  templateUrl: './season-list.component.html',
  styleUrls: ['./season-list.component.scss']
})
export class SeasonListComponent implements OnInit {

  seasons: SeasonWithProgress[] = [];
  groupId?: number;

  constructor(
    private seasonService: SeasonService,
    private router: Router) {
      this.groupId = this.router.getCurrentNavigation()?.extras?.state?.["groupId"];
    }

  ngOnInit(): void {
    this.getAllSeasons();
  }

  handleSeasonClick(season: SeasonWithProgress): void {
    this.router.navigate(['races'], { state: { groupId: this.groupId, seasonId: season.id } });
  }

  private getAllSeasons(): void {
    this.seasonService.getAllSeasons().subscribe({
      next: (seasons) => {
        this.seasons = seasons;
      }
    });
  }
}
