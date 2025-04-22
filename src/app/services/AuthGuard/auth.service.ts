import { Injectable } from '@angular/core';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  users: User[] = [];
  loggedIn = false;
  constructor() { }

  register(surname: string, firstname: string, password: string, email: string, phone: string): void {
    const newUser: User = {
      surname,
      firstname,
      password,
      email,
      phone,
      createdAt: new Date()
    };
    this.users.push(newUser);
  }

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.loggedIn = true;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));

      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  refresh(): void {
    const updatedUser = JSON.parse(localStorage.getItem('currentUser')!);
    const index = this.users.findIndex(user => user.email === updatedUser?.email);
    if (index !== -1) {
      this.users[index] = updatedUser!;
    }
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    this.loggedIn = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
  }

}
