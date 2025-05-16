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
import { collection, Firestore, CollectionReference, getDocs, addDoc, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserModel } from '../../models/user-model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  colRef: CollectionReference;

  constructor(private db: Firestore, private authService: AuthService, private auth: Auth, private router: Router) {
    this.colRef = collection(this.db, 'Users');
  }

  getUserProfileData(): Promise<UserModel | null> {
    return this.authService.getUserData().then((user) => {
      const email = user?.email;
      if (!email) {
        return null;
      }
      const querySnapshot = query(this.colRef, where('email', '==', email));

      return getDocs(querySnapshot).then((snapshot) => {
        let userProfile: UserModel | null = null;
        snapshot.forEach(doc => {
          userProfile = {
            id: doc.id,
            surname: doc.data()['surname'],
            firstname: doc.data()['firstname'],
            email: doc.data()['email'],
            phone: doc.data()['phone'],
            isAdmin: doc.data()['isAdmin'],
            cartId: doc.data()['cartId'],
          };
        });
        return userProfile;
      });
    });
    }
}
