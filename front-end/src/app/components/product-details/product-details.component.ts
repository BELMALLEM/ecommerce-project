import { ProductService } from 'src/app/services/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;
  
  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }

  handleProductDetails() {
    //get the 'id' string and convert it to a number
      const productId: number = +this.route.snapshot.paramMap.get('id')!;
      this.productService.getProduct(productId).subscribe(
        data => this.product = data
      )
  }
  
  addToCart(product: Product) {
    const newCartItem = new CartItem(product);
    this.cartService.addToCart(newCartItem);
  }

}
