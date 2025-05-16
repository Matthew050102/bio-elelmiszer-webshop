import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ProductCardComponent } from '../../child-components/product-card/product-card/product-card.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { ProductService } from '../../services/product/product.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { CartItemModel } from '../../models/cart-item-model';
import { ProductModel } from '../../models/product-model';
import { ProductFormComponent } from '../../child-components/product-form/product-form/product-form.component';
import { BasicDialogComponent } from '../../child-components/basic-dialog/basic-dialog/basic-dialog.component';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-products',
  imports: [MatGridListModule, NgFor, NgIf, MatButtonToggleModule, ProductCardComponent, MatButtonModule, MatIconModule, MatMenuModule, MatSliderModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  dialog: MatDialog = inject(MatDialog);
  router: Router = inject(Router);

  products: ProductModel[] = [];
  categories: string[] = [];
  selectedCategories: string[] = [];
  selectedProducts: ProductModel[] = [];

  favoriteProducts: ProductModel[] = [];

  maxValue: number = 0;

  isAdminUser: boolean = false;

  constructor(private auth: AuthService, private productService: ProductService, private cartService: CartService) { }

  ngOnInit() {
    this.loadData();

    this.auth.isAdmin().then((result) => {
      this.isAdminUser = result;
    });
  }

  filterProducts(event: any): void {
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

  loadData(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.selectedProducts = this.products;
      let maxValue = 0;
      for (let product of this.products) {
        if (product.price > maxValue) {
          maxValue = product.price;
        }
      }
      this.maxValue = maxValue;
    });

    this.productService.getCategories().then((categories) => {
      this.categories = categories;
    });
  }

  openAddProductDialog(): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      data: {
        name: '',
        category: '',
        price: '0',
        description: ''
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result = { ...result, imageUrl: "../assets/images/products/zabpehely.png" }
        this.productService.addProduct(result).then(() => {
          this.loadData();
        }).catch((error) => {
        });
      }
    });
  }

  openUpdateProductDialog(event: any): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      data: {
        id: event['id'],
        name: event['name'],
        category: event['category'],
        price: event['price'],
        description: event['description']
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result = { ...result, imageUrl: "../assets/images/products/zabpehely.png" }
        this.productService.updateProduct(result).then(() => {
          this.loadData();
        }).catch((error) => {
        });
      }
    });

  }

  onAddItemToCart(event: any) {
    this.cartService.addItemToCart(event).then(() => {
    });
  }

  openDeleteProductDialog(event: any): void {
    const dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        id: event['id'],
        name: event['name'],
        category: event['category'],
        price: event['price'],
        description: event['description']
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.deleteProduct(event).then(() => {
          this.loadData();
        }).catch((error) => {
        });
      }
    });
  }

}
