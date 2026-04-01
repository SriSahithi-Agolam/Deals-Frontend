export interface Merchant {
  id?: number;
  businessName: string;
  email: string;
  phone?: string;
  address?: string;
  gstNumber?: string;
  isActive?: boolean;
}

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  category?: string;
  isAvailable?: boolean;
}
