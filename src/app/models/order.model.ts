export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface Order {
  id?: number;
  userId: number;
  merchantId: number;
  orderItems: OrderItem[];
  totalAmount?: number;
  discount?: number;
  finalAmount?: number;
  status?: string;
  deliveryAddress: string;
  orderDate?: string;
  deliveryDate?: string;
  paymentMethod?: string;
}
