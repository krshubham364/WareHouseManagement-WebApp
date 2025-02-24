import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { BrandsComponent } from './component/brands/brands.component';
import { BrandFormComponent } from './component/brands/brand-form/brand-form.component';
import { ProductsComponent } from './component/products/products.component';
import { ProductFormComponent } from './component/products/product-form/product-form.component';
import { OrdersComponent } from './component/orders/orders.component';
import { OrderFormComponent } from './component/orders/order-form/order-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'brands', component: BrandsComponent },
  { path: 'brands/add', component: BrandFormComponent },
  { path: 'brands/:id', component: BrandFormComponent }, // For editing a brand
  { path: 'products', component: ProductsComponent },
  { path: 'products/add', component: ProductFormComponent },
  { path: 'products/:id', component: ProductFormComponent },
  { path: 'orders', component: OrdersComponent},
  {path: 'orders/add', component: OrderFormComponent},
  {path: 'orders/:id', component: OrderFormComponent}


];
