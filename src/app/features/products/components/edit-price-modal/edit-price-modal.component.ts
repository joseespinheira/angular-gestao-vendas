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
  selector: 'app-edit-price-modal',
  templateUrl: './edit-price-modal.component.html',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
})
export class EditpriceModalComponent {
  priceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditpriceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: any }
  ) {
    this.priceForm = this.fb.group({
      price: [data.product.price, [Validators.required, Validators.min(0)]],
    });
  }

  save(): void {
    if (this.priceForm.valid) {
      this.dialogRef.close(this.priceForm.value.price);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
