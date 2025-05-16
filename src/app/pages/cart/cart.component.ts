import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartItemsComponent } from "../../child-components/cart-items/cart-items/cart-items.component";
import { CartItemModel } from '../../models/cart-item-model';
import { CartService } from '../../services/cart/cart.service';
import { FormatPricePipe } from '../../pipes/format-price/format-price.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [NgFor, MatCardModule, MatButtonModule, MatIconModule, CartItemsComponent, FormatPricePipe, NgIf],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {
  cart: CartItemModel[] = [];
  totalPrice: number = 0;
  hasCart: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const cartSub = this.cartService.getCartItems().subscribe((cartItems: CartItemModel[]) => {
      this.getTotalPrice();
      this.cartService.userHasCart().then((hasCart) => {
        this.hasCart = hasCart;
      });
    });

    this.subscriptions.add(cartSub);
  }

  onSubmit() {
    return this.cartService.saveOrder().then(() => {
    });
  }

  getTotalPrice(): void {
    const totalPriceSub = this.cartService.getCartItems().subscribe((updatedCart: CartItemModel[]) => {
      this.cart = updatedCart;

      const promises = this.cart.map(item =>
        this.cartService.getProductDataFromCartItem(item).then(product => {
          if (product) {
            return product.price * item.quantity;
          } else {
            return 0;
          }
        })
      );

      Promise.all(promises).then(prices => {
        this.totalPrice = prices.reduce((acc, price) => acc + price, 0);
      });
    });

    this.subscriptions.add(totalPriceSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}