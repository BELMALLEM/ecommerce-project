import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css'],
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  cartTotalPrice: number = 0;
  cartTotalQuantity: number = 0;
  
  constructor(private cartService: CartService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    //get a handle to the cart items
    this.cartItems = this.cartService.cartItems;

    //subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(data => this.cartTotalPrice = data);

    //subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(data => this.cartTotalQuantity = data);
  }


  incrementQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }
  

  decrementQuantity(cartItem: CartItem) {
    this.cartService.removeFromCart(cartItem);
  }

  removeFromCart(cartItem: CartItem){
    this.cartService.remove(cartItem);
  }
  

}
