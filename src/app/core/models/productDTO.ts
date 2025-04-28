interface ProductDTO {
  id: string;
  name: string;
  description: string;
  stock: number;
  price: number;
  category: string;
  userId: string;
  status: string;
  createdAt: Date;
}

export class Product {
  id: string;
  name: string;
  description: string;
  stock: number;
  price: number;
  category: string;
  userId: string;
  status: string;
  createdAt: Date;

  constructor(partial: ProductDTO) {
    this.id = partial.id || '';
    this.name = partial.name || '';
    this.description = partial.description || '';
    this.stock = partial.stock || 0;
    this.price = partial.price || 0;
    this.category = partial.category || '';
    this.userId = partial.userId || '';
    this.status = partial.status || '1';
    this.createdAt = partial.createdAt || new Date();
  }
}
