import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '@core/services/client.service';
import { PageBaseComponent } from '@shared/components/page-base/page-base.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: [],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddComponent extends PageBaseComponent {
  clientForm!: FormGroup;

  private clientService = inject(ClientService);

  constructor(private fb: FormBuilder, private router: Router) {
    super();
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      createdAt: [Date.now()],
      status: ['1'],
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.clientService
        .addClient(this.clientForm.value)
        .then(() => {
          this.router.navigate(['/clients']);
          return;
        })
        .catch((error) => {
          console.error('Erro ao cadastrar o produto:', error);
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }
}
