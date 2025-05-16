import { Injectable, OnInit } from '@angular/core';
import { CartItemModel } from '../../models/cart-item-model';
import { Firestore, collection, CollectionReference, getDocs, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, where, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ProductService } from '../product/product.service';
import { ProductModel } from '../../models/product-model';
import { RecentOrdersModel } from '../../models/recent-orders-model';

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnInit {
  colRef: CollectionReference;

  constructor(private db: Firestore, private auth: AuthService, private productService: ProductService) {
    this.colRef = collection(this.db, 'Carts');
  }

  ngOnInit(): void {

  }

  userHasCart(): Promise<boolean> {
    return this.auth.getUserData().then((user) => {
      const q = query(
        this.auth.colRef,
        where('email', '==', user?.email),
        where('cartId', '==', null)
      )
      return getDocs(q).then((snapshot) => {
        if (snapshot.empty) {
          return true;
        } else {
          return false;
        }
      });
    })

  }

  getCartItems(): Observable<CartItemModel[]> {
    return new Observable((observer) => {
      this.auth.getUserData().then((user) => {
        const email = user?.email;
        if (!email) {
          return;
        }

        const userQuery = query(this.auth.colRef, where('email', '==', email));
        const unsubscribeUser = onSnapshot(userQuery, (userSnapshot) => {
          let cartId: string | null = null;
          userSnapshot.forEach((doc) => {
            cartId = doc.data()['cartId'];
          });

          if (!cartId) {
            observer.next([]);
            return;
          }

          const cartRef = doc(this.db, 'Carts', cartId);
          const unsubscribeCart = onSnapshot(cartRef, (cartSnapshot) => {
            if (!cartSnapshot.exists()) {
              observer.next([]);
              return;
            }

            const cartItems: CartItemModel[] = cartSnapshot.data()['cartItems'] || [];
            observer.next(cartItems);
          });

          return () => {
            unsubscribeCart();
          };
        });

        return () => {
          unsubscribeUser();
        };
      });
    });
  }


  getProductDataFromCartItem(cartItem: CartItemModel): Promise<ProductModel | null> {
    return getDocs(this.productService.colRef).then((snapshot) => {
      let product: ProductModel | null = null;

      snapshot.forEach(doc => {
        if (doc.id === cartItem.productId) {
          product = {
            id: doc.id,
            name: doc.data()['name'],
            category: doc.data()['category'],
            price: doc.data()['price'],
            description: doc.data()['description'],
            imageUrl: doc.data()['imageUrl']
          }
        }
      });

      return product;
    });
  }

  addItemToCart(cartItem: ProductModel): Promise<void> {
    return this.auth.getUserData().then((user) => {
      const email = user?.email;
      if (!email) {
        return;
      }

      const userQuery = query(this.auth.colRef, where('email', '==', email));
      return getDocs(userQuery).then((snapshot) => {
        let userId: string = "";
        let userDocId: string = "";
        snapshot.forEach((doc) => {
          userDocId = doc.id;
          userId = doc.data()['cartId'];
        });

        if (userId) {
          const cartDocRef = doc(this.db, 'Carts', userId);
          return getDoc(cartDocRef).then((cartDoc) => {
            if (!cartDoc.exists()) {
              return;
            }

            let cartItems: CartItemModel[] = cartDoc.data()['cartItems'] || [];

            const existingItemIndex = cartItems.findIndex((item: CartItemModel) => item.productId === cartItem.id);
            if (existingItemIndex !== -1) {
              cartItems[existingItemIndex].quantity += 1;
            } else {
              cartItems.push({ productId: cartItem.id, quantity: 1, price: cartItem.price });
            }

            return updateDoc(cartDocRef, { cartItems });
          });
        } else {
          const newCartRef = collection(this.db, 'Carts');
          const newCart = {
            cartItems: [{ productId: cartItem.id, quantity: 1 }],
            createdAt: new Date(),
          };
          return addDoc(newCartRef, newCart).then((docRef) => {
            const userDocRef = doc(this.auth.colRef, userDocId);
            return updateDoc(userDocRef, { cartId: docRef.id });
          });
        }
      });
    });
  }



  updateItemQuantity(cartItem: CartItemModel, quantity: number): Promise<void> {
    return this.auth.getUserData().then((user) => {
      const email = user?.email;
      if (!email) {
        return;
      }

      const querySnapshot = query(this.auth.colRef, where('email', '==', email));
      return getDocs(querySnapshot).then((snapshot) => {
        let cartId: string = "";
        snapshot.forEach((doc) => {
          cartId = doc.data()['cartId'];
        });

        if (!cartId) {
          return;
        }
        const cartDocRef = doc(this.db, 'Carts', cartId);
        return getDoc(cartDocRef).then((cartDoc) => {
          if (!cartDoc.exists()) {
            return;
          }

          let cartItems: CartItemModel[] = cartDoc.data()['cartItems'] || [];

          const existingItemIndex = cartItems.findIndex((item: CartItemModel) => item.productId === cartItem.productId);
          if (existingItemIndex !== -1) {
            cartItems[existingItemIndex].quantity = quantity;
          } else {
            return;
          }

          return updateDoc(cartDocRef, { cartItems });
        });
      });

    });
  }

  deleteProductFromCart(cartItem: CartItemModel): Promise<void> {
    return this.auth.getUserData().then((user) => {
      const email = user?.email;
      if (!email) {
        return;
      }

      const querySnapshot = query(this.auth.colRef, where('email', '==', email));
      return getDocs(querySnapshot).then((snapshot) => {
        let cartId: string = "";
        let userId: string = "";

        snapshot.forEach((doc) => {
          cartId = doc.data()['cartId'];
          userId = doc.id;
        });

        if (!cartId) {
          return;
        }
        const cartDocRef = doc(this.db, 'Carts', cartId);
        return getDoc(cartDocRef).then((cartDoc) => {
          if (!cartDoc.exists()) {
            return;
          }

          let cartItems: CartItemModel[] = cartDoc.data()['cartItems'] || [];

          const existingItemIndex = cartItems.findIndex((item: CartItemModel) => item.productId === cartItem.productId);
          if (existingItemIndex !== -1) {
            cartItems.splice(existingItemIndex, 1);
          } else {
            return;
          }
          if (cartItems.length === 0) {
            return deleteDoc(cartDocRef).then(() => {
              const userDocRef = doc(this.auth.colRef, userId);

              return updateDoc(userDocRef, { cartId: null });
            });
          }
          return updateDoc(cartDocRef, { cartItems });
        });
      });

    });
  }

  saveOrder(): Promise<void> {
  return this.auth.getUserData().then(user => {
    if (!user?.email) {
      return;
    }

    const userQuery = query(this.auth.colRef, where('email', '==', user.email));
    return getDocs(userQuery).then(snapshot => {
      let cartId = '';
      let userId = '';
      snapshot.forEach(doc => {
        cartId = doc.data()['cartId'];
        userId = doc.id;
      });

      if (!cartId) {
        return;
      }

      const cartDocRef = doc(this.db, 'Carts', cartId);
      return getDoc(cartDocRef).then(cartDoc => {
        if (!cartDoc.exists()) {
          return;
        }

        const cartItems: CartItemModel[] = cartDoc.data()['cartItems'] || [];

        const productFetches = cartItems.map(item =>
          this.getProductDataFromCartItem(item).then(product => {
            if (!product) {
              throw new Error('Termék nem található');
            }
            return {
              productId: item.productId,
              name: product.name,
              price: product.price,
              quantity: item.quantity
            };
          })
        );

        return Promise.all(productFetches).then(products => {
          const totalPrice = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

          const order: RecentOrdersModel = {
            userId,
            createdAt: new Date(),
            totalPrice,
            products
          };

          const recentOrdersRef = collection(this.db, 'RecentOrders');
          return addDoc(recentOrdersRef, order).then(() => {
            return deleteDoc(cartDocRef).then(() => {
              const userDocRef = doc(this.auth.colRef, userId);
              return updateDoc(userDocRef, { cartId: null });
            });
          });
        });
      });
    });
  });
}


}
