import { CartItemModel } from "./cart-item-model";
import { Timestamp } from '@angular/fire/firestore';

export interface RecentOrdersModel {
  id?: string;
  userId: string;
  createdAt: Timestamp | Date;
  totalPrice: number;
  products: CartItemModel[];
}