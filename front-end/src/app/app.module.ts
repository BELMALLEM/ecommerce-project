import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { SearchModule } from './search/search.module';
import { CartModule } from './cart/cart.module';
import { ProductModule } from './product/product.module';
import { BrowserModule } from '@angular/platform-browser';
import { CheckoutModule } from './checkout/checkout.module';
import { SessionModule } from './session/session.module';


const routes: Routes = [
  {path: '', redirectTo: 'products', pathMatch: 'full'},
  {path: '**', redirectTo: 'products', pathMatch: 'full'},
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    CartModule,
    CheckoutModule,
    ProductModule,
    SearchModule,
    SessionModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
