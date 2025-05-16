import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';
import { ProductModel } from '../../../models/product-model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormatPricePipe } from '../../../pipes/format-price/format-price.pipe';
import { ShorterTextPipe } from '../../../pipes/shorter-text/shorter-text.pipe';
import { AuthService } from '../../../services/auth/auth.service';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-product-card',
  imports: [FormatPricePipe, ShorterTextPipe, MatCardModule, MatButtonModule, MatIconModule, NgIf, NgStyle],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})

export class ProductCardComponent {
  @Input() product!: ProductModel;
  @Output() addedToCart = new EventEmitter<ProductModel>();
  @Output() deleteProduct = new EventEmitter<ProductModel>();
  @Output() updateProduct = new EventEmitter<ProductModel>();

  isAdminUser: boolean = false;


  constructor(private auth: AuthService, private productService: ProductService) {
    this.auth.isAdmin().then((result) => {
      this.isAdminUser = result;
    });
  }

  onAddToCart() {
    this.addedToCart.emit(this.product);
  }

  onDeleteProduct() {
    this.deleteProduct.emit(this.product);
  }

  onUpdateProduct() {
    this.updateProduct.emit(this.product);
  }

}
