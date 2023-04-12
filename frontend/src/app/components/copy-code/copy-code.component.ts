import { Component, Input } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-copy-code',
  templateUrl: './copy-code.component.html',
  styleUrls: ['./copy-code.component.scss']
})
export class CopyCodeComponent {

  @Input() code?: string;

  constructor(
    private clipboard: Clipboard,
    private snackBar: MatSnackBar) { }

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
      this.snackBar.open('Code copied to clipboard', '', { duration: 3000 });
    }
  }

}
