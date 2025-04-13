import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css'],
  imports: [CommonModule],
})
export class SalesListComponent {
  sales = [
    { id: 1, client: 'Cliente A', total: 150.0, date: '2025-04-13' },
    { id: 2, client: 'Cliente B', total: 200.0, date: '2025-04-12' },
    { id: 3, client: 'Cliente C', total: 300.0, date: '2025-04-11' }
  ];
}