export interface Shoe {
  id: number;
  name: string;
  brand: string;
  price: number;
  stock: number;
  imageUrl: string;
  description?: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface CreateShoeDTO {
  name: string;
  brand: string;
  price: number;
  stock: number;
  imageUrl: string;
  description?: string;
}

export interface UpdateShoeDTO {
  name?: string;
  brand?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  description?: string;
  isAvailable?: boolean;
}