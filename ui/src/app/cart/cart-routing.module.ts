import { NgModule } from '@angular/core';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'cart-details', component: CartDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
