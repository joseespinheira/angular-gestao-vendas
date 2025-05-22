import { Product } from './productDTO';

interface SaleDTO {
  id: string;
  clientId: string;
  clientName: string;
  products: [];
  total: number;
  userId: string;
  status: string;
  createdAt: Date;
  totalPaid: number;
}

export class Sale {
  id: string;
  clientId: string;
  clientName: string;
  products: Product[];
  total: number;
  userId: string;
  status: string;
  createdAt: Date;
  totalPaid: number;

  constructor(partial: SaleDTO) {
    this.id = partial.id || '';
    this.clientId = partial.clientId || '';
    this.clientName = partial.clientName || '';
    this.products = partial.products || [];
    this.total = partial.total || 0;
    this.userId = partial.userId || '';
    this.status = partial.status || '1';
    this.createdAt = partial.createdAt || new Date();
    this.totalPaid = partial.totalPaid || 0;
  }
}
