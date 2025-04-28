import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { PageBaseComponent } from '@shared/components/page-base/page-base.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: [],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddComponent extends PageBaseComponent {
  productForm!: FormGroup;

  private productService = inject(ProductService);

  constructor(private fb: FormBuilder, private router: Router) {
    super();
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      createdAt: [Date.now()],
      status: ['1'],
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.productService
        .addProduct(this.productForm.value)
        .then(() => {
          console.log('Produto cadastrado com sucesso!');
          this.router.navigate(['/products']);
        })
        .catch((error) => {
          console.error('Erro ao cadastrar o produto:', error);
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
