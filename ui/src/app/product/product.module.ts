import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCategoryMenuComponent } from './product-category-menu/product-category-menu.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductRoutingModule } from './product-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    ProductListComponent,
    ProductCategoryMenuComponent,
    ProductDetailsComponent],
  imports: [
    CommonModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    ProductRoutingModule
  ],
  exports: [
    ProductCategoryMenuComponent
  ]
})
export class ProductModule { }
