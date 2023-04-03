import { Component, OnInit } from "@angular/core";
import { Season } from "src/app/model/entities/season.model";
import { SeasonService } from "src/app/services/season.service";

@Component({
  selector: 'app-season-list',
  templateUrl: './season-list.component.html',
  styleUrls: ['./season-list.component.scss']
})
export class SeasonListComponent implements OnInit {

  seasons: Season[] = [];

  constructor(private seasonService: SeasonService) {}

  ngOnInit(): void {
    this.getAllSeasons();
  }

  handleSeasonClick(season: Season): void {
    console.log('season', season);
  }

  private getAllSeasons(): void {
    this.seasonService.getAllSeasons().subscribe({
      next: (seasons) => {
        this.seasons = seasons;
      }
    });
  }
}
