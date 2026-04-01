export interface User {
  id?: number;
  fullName: string;
  email: string;
  phone?: string;
}

export interface CashbackBalance {
  userId: number;
  balance: number;
}
