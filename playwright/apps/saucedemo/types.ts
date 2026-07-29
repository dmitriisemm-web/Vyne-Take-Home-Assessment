export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface CartItem {
  name: string;
  price: number;
}

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';
