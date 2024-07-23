import { NgModule } from '@angular/core';
import { CheckoutComponent } from './components/checkout.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'checkout', component: CheckoutComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
