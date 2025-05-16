import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CartItemModel } from '../../../models/cart-item-model';
import { CartService } from '../../../services/cart/cart.service';
import { FormatPricePipe } from '../../../pipes/format-price/format-price.pipe';

@Component({
  selector: 'app-cart-items',
  imports: [MatCard, MatCardContent, MatIcon, MatButtonModule, FormatPricePipe],
  templateUrl: './cart-items.component.html',
  styleUrl: './cart-items.component.scss'
})
export class CartItemsComponent implements OnInit {
  @Input() item!: CartItemModel;
  @Output() totalPrice = new EventEmitter<void>();
  @Output() deleteProduct = new EventEmitter<void>();
  product: any=null;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadData();
  }

  onChangeQuantity(event: any): Promise<void> {
    return this.cartService.updateItemQuantity(this.item, parseInt(event.target.value)).then(() => {
      this.totalPrice.emit();
      this.loadData();
    });
  }

  onDeleteProductFromCart() {
    return this.cartService.deleteProductFromCart(this.item).then(() => {
      this.deleteProduct.emit();
    });
  }

  loadData(): Promise<void> {
    return this.cartService.getProductDataFromCartItem(this.item).then((product) => {
      if (product) {
        this.product = product;
      } else {
      }
    });
  }

}
