import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product/product.service';
import { Observable, of } from 'rxjs';
import { ProductModel } from '../../models/product-model';
import { AuthService } from '../../services/auth/auth.service';
import { FormatPricePipe } from '../../pipes/format-price/format-price.pipe';
import { ShorterTextPipe } from '../../pipes/shorter-text/shorter-text.pipe';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss'],
  standalone: true,
  imports: [CommonModule, ShorterTextPipe, FormatPricePipe],
})
export class RecommendationsComponent implements OnInit {
  oatProducts$: Observable<ProductModel[]> = of([]);
  expensiveProducts$: Observable<ProductModel[]> = of([]);
  budgetVeggies$: Observable<ProductModel[]> = of([]);
  glutenFreeProducts$: Observable<ProductModel[]> = of([]);
  
  selectedQuery: QueryType = '';
  
  loading: boolean = false;
  
  queryDescriptions: Record<NonEmptyQueryType, string> = {
    oatUnder500: "500 Ft alatti gabonafélék - megfizethető, egészséges alapanyagok a mindennapokra (Kategória neve: Gabonafélék)",
    expensiveWithDesc: "Prémium minőségű termékek részletes termékleírással (10.000 Ft felett)",
    glutenFree: "Gluténmentes bio termékek - speciális étrendhez igazított választék (Kategória neve: Gluténmentes)",
    budgetVeggies: "3000 Ft alatti bio zöldségek - friss, megfizethető kertészeti termékek (Kategória neve: Zöldség)"
  };

  activeProducts: ProductModel[] = [];
  
  constructor(private productService: ProductService, private authService: AuthService) { }

  ngOnInit(): void {
    this.oatProducts$ = this.productService.getOatUnderFiveHundred();
    this.expensiveProducts$ = this.productService.getExpensiveProductsWithDescription();
    this.glutenFreeProducts$ = this.productService.getGlutenFreeProducts();
    this.budgetVeggies$ = this.productService.getBudgetVeggies();
  }
  
  changeQuery(queryType: string): void {
    this.selectedQuery = queryType as QueryType;
    this.loading = true;
    
    this.updateActiveProducts();
    
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }
  
  get activeProducts$(): ProductModel[] {
    return this.activeProducts;
  }
  
  updateActiveProducts(): void {
    const observable = this.getProductObservable();
    if (observable) {
      observable.subscribe(products => {
        this.activeProducts = products || [];
      });
    } else {
      this.activeProducts = [];
    }
  }
  
  private getProductObservable(): Observable<ProductModel[]> | null {
    switch(this.selectedQuery) {
      case 'oatUnder500':
        return this.oatProducts$;
      case 'expensiveWithDesc':
        return this.expensiveProducts$;
      case 'glutenFree':
        return this.glutenFreeProducts$;
      case 'budgetVeggies':
        return this.budgetVeggies$;
      default:
        return null;
    }
  }
}

type QueryType = '' | NonEmptyQueryType;

type NonEmptyQueryType = 'oatUnder500' | 'expensiveWithDesc' | 'glutenFree' | 'budgetVeggies';