import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { ErrorTypeEnum } from '@core/enums/error-type.enum';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styles: [],
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
  ],
})
export class ErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { message: string; type: ErrorTypeEnum }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
