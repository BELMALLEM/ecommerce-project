import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartRoutingModule } from './cart-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductModule } from '../product/product.module';

const routes: Routes = [
  {path: 'cart-details', component: CartDetailsComponent}
];

@NgModule({
  declarations: [
    CartDetailsComponent,
    CartStatusComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    CartRoutingModule,
    ReactiveFormsModule,
    ProductModule
  ],
  exports: [
    CartDetailsComponent,
    CartStatusComponent
  ]
})
export class CartModule { }
