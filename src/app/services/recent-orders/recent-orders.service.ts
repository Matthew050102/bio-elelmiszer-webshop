import { Injectable } from '@angular/core';
import { collection, CollectionReference, doc, Firestore, getDoc, getDocs, query, Timestamp, where } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { RecentOrdersModel } from '../../models/recent-orders-model';
import { ProductService } from '../product/product.service';

@Injectable({
  providedIn: 'root'
})
export class RecentOrdersService {
  colRef: CollectionReference;

  constructor(private db: Firestore, private auth: AuthService, private productService: ProductService) {
    this.colRef = collection(this.db, 'RecentOrders');
  }

  getRecentOrders(userId: string) {
    const ordersQuery = query(this.colRef, where('userId', '==', userId));
    return getDocs(ordersQuery).then((querySnapshot) => {
      let recentOrders = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as RecentOrdersModel));
      recentOrders = recentOrders.map((order) => {
        if (order.createdAt instanceof Timestamp) {
          order.createdAt = order.createdAt.toDate();
        }
        return order;
      });
      return recentOrders;
    });
  }

  getRecentOrdersProducts(recentOrder: RecentOrdersModel): Promise<any[]> {
    if (!recentOrder?.products || !Array.isArray(recentOrder.products)) {
      return Promise.resolve([]);
    }

    const productPromises = recentOrder.products.map((item) => {
      const docRef = doc(this.productService.colRef, item.productId);
      return getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        } else {
          return null;
        }
      });
    });

    return Promise.all(productPromises)
      .then((results) => results.filter((p) => p !== null))
      .catch((error) => {
        return [];
      });
  }

  getQuantityFromProducts(recentOrder: RecentOrdersModel): number {
    if (!recentOrder?.products || !Array.isArray(recentOrder.products)) {
      return 0;
    }

    return recentOrder.products.reduce((total, item) => {
      if (item.quantity && typeof item.quantity === 'number') {
        return total + item.quantity;
      } else {
        return total;
      }
    }, 0);
  } 

  

}
