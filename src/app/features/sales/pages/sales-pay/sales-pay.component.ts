import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageBaseComponent } from '@shared/components/page-base/page-base.component';
import { HeaderService } from '../../../../core/services/header.service';

@Component({
  selector: 'app-sales-pay',
  templateUrl: './sales-pay.component.html',
  imports: [],
})
export class SalesPayComponent extends PageBaseComponent implements OnInit {
  private router = inject(Router);
  private header = inject(HeaderService);

  constructor() {
    super();
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }

  ngOnInit(): void {
    this.header.setTitle('Registrar Pagamento');
  }

  ngOnDestroy(): void {
    this.header.setTitleDefault();
  }
}
