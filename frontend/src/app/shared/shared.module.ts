import { NgModule } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

// CDK
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';

//Components
import { GroupComponent } from 'src/app/components/group/group.component';
import { DriverDragDropComponent } from '../components/driver-drag-drop/driver-drag-drop.component';
import { DriverNameComponent } from '../components/driver-name/driver-name.component';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.compnent';
import { DriverFirstNamePipe } from '../pipes/driver-first-name.pipe';
import { DriverLastNamePipe } from '../pipes/driver-last-name.pipe';
import { ToFixedStringPipe } from '../pipes/to-fixed-string.pipe';

// Other modules
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CopyCodeComponent } from '../components/copy-code/copy-code.component';

@NgModule({
  declarations: [
    GroupComponent,
    DriverDragDropComponent,
    DriverNameComponent,
    ConfirmationDialogComponent,
    CopyCodeComponent,
    DriverFirstNamePipe,
    DriverLastNamePipe,
    ToFixedStringPipe
  ],
  imports: [
    FormsModule,
    TranslateModule,
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatCardModule,
    MatNativeDateModule,
    MatTabsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ClipboardModule,
    DragDropModule,
  ],
  exports: [
    CopyCodeComponent,
    FormsModule,
    GroupComponent,
    DriverDragDropComponent,
    DriverNameComponent,
    ConfirmationDialogComponent,
    DriverFirstNamePipe,
    DriverLastNamePipe,
    ToFixedStringPipe,
    TranslateModule,
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatCardModule,
    MatNativeDateModule,
    MatTabsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ClipboardModule,
    DragDropModule
  ]
})
export class SharedModule {

}
