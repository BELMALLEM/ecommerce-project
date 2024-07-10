import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();
  
  constructor() { }

  addToCart(cartItem: CartItem){
    //check if we already have the item in the cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined;

    if(this.cartItems.length > 0){
      //find the item on the cart based on the item id
      existingCartItem = this.cartItems.find(item => item.id === cartItem.id);
      
      //check if we found it
      alreadyExistsInCart = (existingCartItem !== undefined);
    }

    if(alreadyExistsInCart){
      //increments the quantity
      existingCartItem!.quantity++;
    }else{
      this.cartItems.push(cartItem);
    }

    //compute cart total price and quantity
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    this.cartItems.forEach(item => {
      totalPriceValue += item.quantity * item.unitPrice;
      totalQuantityValue += item.quantity;
    });

    //publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }

  decrementQuantity(cartItem: CartItem) {
    
    if(cartItem.quantity === 1){
      this.remove(cartItem);
    }else{
      cartItem.quantity--;
      this.computeCartTotals();
    }

  }

  remove(cartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(item => cartItem.id === item.id);
    
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

}
