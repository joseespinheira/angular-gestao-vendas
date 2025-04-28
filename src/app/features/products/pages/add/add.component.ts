import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: [],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddComponent implements OnInit {
  productForm!: FormGroup;

  private auth = inject(AuthService);

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = {
        ...this.productForm.value,
        userId: this.auth.getCurrentUser()!.uid,
      };
      const productCollection = collection(this.firestore, 'products');

      addDoc(productCollection, productData)
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
