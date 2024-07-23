import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CheckoutComponent } from './components/checkout.component';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    CheckoutRoutingModule
  ]
})
export class CheckoutModule { }
