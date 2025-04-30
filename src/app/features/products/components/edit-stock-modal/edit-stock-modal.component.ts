import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-stock-modal',
  templateUrl: './edit-stock-modal.component.html',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
})
export class EditStockModalComponent {
  stockForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditStockModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: any }
  ) {
    this.stockForm = this.fb.group({
      stock: [data.product.stock, [Validators.required, Validators.min(0)]],
    });
  }

  save(): void {
    if (this.stockForm.valid) {
      this.dialogRef.close(this.stockForm.value.stock);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
