interface SaleDTO {
  id: string;
  clientId: string;
  clientName: string;
  products: [];
  total: number;
  userId: string;
  status: string;
  createdAt: Date;
}

export class Sale {
  id: string;
  clientId: string;
  clientName: string;
  products: [];
  total: number;
  userId: string;
  status: string;
  createdAt: Date;

  constructor(partial: SaleDTO) {
    this.id = partial.id || '';
    this.clientId = partial.clientId || '';
    this.clientName = partial.clientName || '';
    this.products = partial.products || [];
    this.total = partial.total || 0;
    this.userId = partial.userId || '';
    this.status = partial.status || '1';
    this.createdAt = partial.createdAt || new Date();
  }
}
