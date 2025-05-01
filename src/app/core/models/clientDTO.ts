interface ClientDTO {
  id: string;
  name: string;
  userId: string;
  status: string;
  createdAt: Date;
}

export class Client {
  id: string;
  name: string;
  userId: string;
  status: string;
  createdAt: Date;

  constructor(partial: ClientDTO) {
    this.id = partial.id || '';
    this.name = partial.name || '';
    this.userId = partial.userId || '';
    this.status = partial.status || '1';
    this.createdAt = partial.createdAt || new Date();
  }
}
