import { Injectable } from '@angular/core';
import { ProductModel } from '../../models/product-model';
import { Firestore, collection, CollectionReference, getDocs, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, where, orderBy, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  colRef: CollectionReference;

  constructor(private db: Firestore, private auth: AuthService) {
    this.colRef = collection(this.db, 'Products');
  }


  addProduct(product: ProductModel): Promise<string> {
    return addDoc(this.colRef, product)
      .then((docRef) => {
        const productId = docRef.id;
        const productRef = doc(this.db, 'Products', productId);
        updateDoc(productRef, {
          id: productId
        });
        return docRef.id;
      }).catch((error) => {
        throw error;
      });
  }

  deleteProduct(product: ProductModel): Promise<void> {
    const docRef = doc(this.db, 'Products', product.id);
    return deleteDoc(docRef).then(() => {
    }).catch((error) => {
      throw error;
    });
  }

  updateProduct(product: ProductModel): Promise<void> {
    const docRef = doc(this.db, 'Products', product.id);
    return updateDoc(docRef, {
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl
    }).then(() => {
    }).catch((error) => {
      throw error;
    });
  }

  getProducts(): Observable<ProductModel[]> {
    return new Observable((observer) => {
      const productsRef = collection(this.db, 'Products');
      const q = query(
        productsRef,
        where('name', '!=', null),
        where('price', '>', 0)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        let products: ProductModel[] = [];
        snapshot.forEach((doc) => {
          products.push({
            id: doc.id,
            name: doc.data()['name'],
            category: doc.data()['category'],
            price: doc.data()['price'],
            description: doc.data()['description'],
            imageUrl: doc.data()['imageUrl'],
          });
        });
        observer.next(products);
      });
      return () => unsubscribe();
    });
  }

  getOatUnderFiveHundred(): Observable<ProductModel[]> {
    return new Observable((observer) => {
      const productsRef = collection(this.db, 'Products');
      const q = query(
        productsRef,
        where('category', '==', 'Gabonafélék'),
        where('price', '<=', 500),
        orderBy('price', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        let products: ProductModel[] = [];
        snapshot.forEach((doc) => {
          products.push({
            id: doc.id,
            name: doc.data()['name'],
            category: doc.data()['category'],
            price: doc.data()['price'],
            description: doc.data()['description'],
            imageUrl: doc.data()['imageUrl'],
          });
        });
        observer.next(products);
      });
      return () => unsubscribe();
    });
  }

  getExpensiveProductsWithDescription(): Observable<ProductModel[]> {
    return new Observable((observer) => {
      const q = query(
        collection(this.db, 'Products'),
        where('price', '>=', 10000),
        where('description', '!=', ''),
        orderBy('price', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        let products: ProductModel[] = [];
        snapshot.forEach((doc) => {
          products.push({
            id: doc.id,
            name: doc.data()['name'],
            category: doc.data()['category'],
            price: doc.data()['price'],
            description: doc.data()['description'],
            imageUrl: doc.data()['imageUrl'],
          });
        });
        observer.next(products);
      });
      return () => unsubscribe();
    });
  }

  getBudgetVeggies(): Observable<ProductModel[]> {
    return new Observable((observer) => {
      const q = query(
        collection(this.db, 'Products'),
        where('category', '==', 'Zöldség'),
        where('price', '<', 3000),
        orderBy('price', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        let products: ProductModel[] = [];
        snapshot.forEach((doc) => {
          products.push({
            id: doc.id,
            name: doc.data()['name'],
            category: doc.data()['category'],
            price: doc.data()['price'],
            description: doc.data()['description'],
            imageUrl: doc.data()['imageUrl'],
          });
        });
        observer.next(products);
      });
      return () => unsubscribe();
    });
  }

  getGlutenFreeProducts(): Observable<ProductModel[]> {
  return new Observable((observer) => {
    const productsRef = collection(this.db, 'Products');
    const q = query(
      productsRef,
      where('name', '!=', null),
      where('category', '==', 'Gluténmentes'),
      orderBy('price', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let products: ProductModel[] = [];
      snapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          name: doc.data()['name'],
          category: doc.data()['category'],
          price: doc.data()['price'],
          description: doc.data()['description'],
          imageUrl: doc.data()['imageUrl'],
        });
      });
      observer.next(products);
    });
    return () => unsubscribe();
  });
}  

  getCategories(): Promise<string[]> {
    return getDocs(this.colRef).then((snapshot) => {
      const categories: string[] = [];
      snapshot.forEach((docSnap) => {
        const category = docSnap.data()['category'];
        if (!categories.includes(category)) {
          categories.push(category);
        }
      });
      return categories;
    });
  }

  getProductById(productId: string): Promise<ProductModel | null> {
    const docRef = doc(this.db, 'Products', productId);

    return getDocs(query(this.colRef, where('__name__', '==', productId)))
      .then(snapshot => {
        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: data['name'],
            category: data['category'],
            price: data['price'],
            description: data['description'],
            imageUrl: data['imageUrl'],
          } as ProductModel;
        }
        return null;
      })
      .catch(error => {
        return null;
      });
  }


}
