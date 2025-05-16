import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential
} from '@angular/fire/auth';
import { getFirestore, collection, Firestore, CollectionReference, getDocs, addDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserModel } from '../../models/user-model';
import { CartItemModel } from '../../models/cart-item-model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  colRef: CollectionReference;
  currentUser: Observable<User | null>;
  userId: string | null = null;

  constructor(private db: Firestore, private auth: Auth, private router: Router) {
    this.currentUser = authState(this.auth);
    this.colRef = collection(this.db, 'Users');this.getUserId().then((userId) => {
      this.userId = userId;
    });
  }

  register(surname: string, firstname: string, password: string, email: string, phone: string, isAdmin: boolean): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password).then(() => {
      const newUser: UserModel = {
        surname: surname,
        firstname: firstname,
        email: email,
        phone: phone,
        isAdmin: isAdmin,
        cartId: ""
      }
      addDoc(this.colRef, newUser).then(() => {
        this.router.navigateByUrl('/login');
      })
    }).catch((error) => {
      throw error;
    });

  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(this.auth).then(() => {
      this.router.navigateByUrl('/');
    });
  }

  isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.currentUser.subscribe((user) => {
        observer.next(user !== null);
      });
    });
  }

  isAdmin(): Promise<boolean> {
    return getDocs(this.colRef).then((snapshot) => {
      const currentUserEmail = this.auth.currentUser?.email;

      for (const doc of snapshot.docs) {
        if (doc.data()['email'] === currentUserEmail) {
          return doc.data()['isAdmin'];
        }
      }

      return false;
    });
  }

  getUserData(): Promise<UserModel | null> {
    return getDocs(this.colRef).then((snapshot) => {
      const currentUserEmail = this.auth.currentUser?.email;
        
        for (const doc of snapshot.docs) {
          if (doc.data()['email'] === currentUserEmail) {
            const userData: UserModel = { 
              surname: doc.data()['surname'],
              firstname: doc.data()['firstname'],
              email: doc.data()['email'],
              phone: doc.data()['phone'],
              isAdmin: doc.data()['isAdmin'],
              cartId: doc.data()['cartId'],
            
             };

            return userData;
          }
        }
        return null;
    });

  }

  getUserId(): Promise<string | null> {
    return getDocs(this.colRef).then((snapshot) => {
      const currentUserEmail = this.auth.currentUser?.email;

      for (const doc of snapshot.docs) {
        if (doc.data()['email'] === currentUserEmail) {
          return doc.id;
        }
      }

      return null;
    });
  }

}
