import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { SeasonWithProgress } from "src/app/model/types/season-with-progress";
import { NavigationService } from "src/app/services/navigation.service";
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
    private router: Router,
    private navigationService: NavigationService,
    public translateService: TranslateService) {
      this.groupId = this.router.getCurrentNavigation()?.extras?.state?.["groupId"];
    }

  ngOnInit(): void {
    this.navigationService.notifyAboutInitRoute('seasons');
    this.getAllSeasons();
  }

  handleSeasonClick(season: SeasonWithProgress): void {
    const navExtras = { state: { groupId: this.groupId, seasonId: season.id } };
    const name = this.translateService.instant('navigation.races');
    const navItem = {
      url: 'races',
      name,
      translateName: 'races',
      navExtras
    };
    this.navigationService.notifyAboutNavItem(navItem);
    this.router.navigate(['races'], navExtras);
  }

  private getAllSeasons(): void {
    this.seasonService.getAllSeasons().subscribe({
      next: (seasons) => {
        this.seasons = seasons;
      }
    });
  }
}
