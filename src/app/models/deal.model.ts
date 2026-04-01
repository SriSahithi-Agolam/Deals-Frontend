export interface Deal {
  id?: number;
  title: string;
  description?: string;
  discount: number;
  category: string;
  price: number;
  expiryDate: string;
  merchantId: number;
  cashbackPoints?: number;
  usageLimit?: number;
  totalUsed?: number;
  couponCode: string;
  location?: string;
}
