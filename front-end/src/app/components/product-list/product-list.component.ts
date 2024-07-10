import { CartItem } from './../../common/cart-item';
import { Product } from 'src/app/common/product';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;

  //pagination properties
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  //search parameters
  searchMode: boolean = false;
  previousKeyword: string = "";
  
  constructor(private productService: ProductService, 
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() =>
    {
        this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
  }

  handleListProducts(){

    //check if "id" param is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }else {
      //assign default value
      this.currentCategoryId = 1;
    }

    //
    //check if we have a diferent category than previous
    //Note: Angular will reuse a component if it is being viewed
    //

    //if we have a diferent category than previous
    //then reset the page number to 0
    if(this.previousCategoryId !== this.currentCategoryId){
      this.pageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginate(this.pageNumber - 1, 
                                               this.pageSize, 
                                               this.currentCategoryId)
                                              .subscribe(this.processPaginationResult())
  }

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

    //if we have a different keyword than previous
    //we set page number to 1
    if(this.previousKeyword !== keyword){
      this.pageNumber = 1;
    }
    this.previousKeyword = keyword;

    //now search for products using keyword
    this.productService.searchProductsPaginate(this.pageNumber, 
                                               this.pageSize, 
                                               keyword)
                                              .subscribe(this.processPaginationResult())
  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }


  processPaginationResult(){
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    }
  }


  addToCart(product: Product) {
    const newCartItem = new CartItem(product);
    this.cartService.addToCart(newCartItem);
  }
}
