import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProductsObjects } from '../../data/products/products';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormatPricePipe } from '../../pipes/format-price/format-price.pipe';


@Component({
  selector: 'app-products',
  imports: [MatCardModule, MatButtonModule, MatGridListModule, MatIconModule,
    MatButtonToggleModule, FormatPricePipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  products = ProductsObjects;
  categories: string[] = [];
  selectedCategories: string[] = [];
  selectedProducts = this.products;


  constructor() {
    for (let product of this.products) {
      if (!this.categories.includes(product.category.trim())) {
        this.categories.push(product.category.trim());
      }
    }
  }

  filterProducts(event: any) {
    this.selectedCategories = event.value;
    if (this.selectedCategories.length === 0) {
      this.selectedProducts = this.products;
    } else {
      this.selectedProducts = [];
      for (let product of this.products) {
        if (this.selectedCategories.includes(product.category)) {
          this.selectedProducts.push(product);
        }
      }
    }
  }

}
