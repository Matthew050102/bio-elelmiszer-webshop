import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cart',
  imports: [NgFor, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartItems = [
    { name: 'Organikus Goji bogyó', price: 3100, quantity: 2 },
    { name: 'BIO Aszalt Áfonya', price: 2790, quantity: 1 }
  ];

  getTotalPrice(): number {
    let total = 0;
    for (const item of this.cartItems) {
      total += item.price * item.quantity;
    }
    return total;
  }

  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
  }
}
