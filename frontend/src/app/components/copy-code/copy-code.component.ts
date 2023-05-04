import { Component, Input } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Clipboard } from '@angular/cdk/clipboard';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-copy-code',
  templateUrl: './copy-code.component.html',
  styleUrls: ['./copy-code.component.scss']
})
export class CopyCodeComponent {

  @Input() code?: string;

  constructor(
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    public translateService: TranslateService) { }

  codeCopied: boolean = false;

  resetState(): void {
    setTimeout(() => {
      this.codeCopied = false;
    }, 500);
  }

  copyToClipboard() {
    if(!this.codeCopied && this.code) {
      this.clipboard.copy(this.code);
      this.codeCopied = true;
      const msg = this.translateService.instant('group.codeCopied');
      this.snackBar.open(msg, '', { duration: 3000 });
    }
  }

}
