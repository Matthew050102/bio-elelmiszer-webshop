import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { authGuard, authRedirectGuard } from './guards/auth.guard';


export const routes: Routes = [
    {path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)},
    {path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)},
    {path: 'products', loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent), canActivate: [authGuard]},
    {path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent), canActivate: [authRedirectGuard]},
    {path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent), canActivate: [authRedirectGuard]},
    {path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent), canActivate: [authGuard]},
    {path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard]},
    {path: 'recent-orders', loadComponent: () => import('./pages/recent-orders/recent-orders.component').then(m => m.RecentOrdersComponent), canActivate: [authGuard]},
    {path: 'recommendations', loadComponent: () => import('./pages/recommendations/recommendations.component').then(m => m.RecommendationsComponent), canActivate: [authGuard]},


    {path: '', redirectTo: 'home',  pathMatch: 'full'},
    {path: '**', component: PageNotFoundComponent}
];
