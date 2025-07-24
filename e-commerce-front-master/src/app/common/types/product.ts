export interface ISizeVariant {
  name: string;
  sizes: string[];
}

export interface IProduct {
  name: string;
  SKU: string;
  description: string;
  price: number;
  stock: number;
  userId: string;
  discount: number;
  status?: 'active' | 'inactive' | 'archived';
  categoryId: string;
  manufacturerId?: string;
  features?: string[];
  tags?: string[];

  documents?: DocumentInputDto[];
}

export interface DocumentInputDto {
  name: string;

  url: string;
}

export interface IManufacturor {
  name: string;
  details: string;
}

export interface IVariant {
  name: string;
  label: string;
  values: string[];
}
