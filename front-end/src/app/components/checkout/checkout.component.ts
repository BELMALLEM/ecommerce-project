import { CartService } from './../../services/cart.service';
import { ShopFormService } from './../../services/shop-form.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { notOnlyWhiteSpacesValidator } from 'src/app/common/shop-form-validators';
import { State } from 'src/app/common/state';
import { CheckoutService } from 'src/app/services/checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countriesList: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  constructor(
    private formBuilder: FormBuilder,
    private shopFormService: ShopFormService,
    private cartService: CartService,
    private checkouService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const emailPattern = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$';
    const creditCardNumberPattern = '[0-9]{16}';
    const creditCardSecurityCodePattern = '[0-9]{3}';

    this.reviewCartDetails();

    const userEmail = JSON.parse(this.storage.getItem('userEmail'));

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(3), notOnlyWhiteSpacesValidator()]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(3), notOnlyWhiteSpacesValidator()]),
        email: new FormControl(userEmail, [Validators.required, Validators.pattern(emailPattern)]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(3), notOnlyWhiteSpacesValidator()]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), notOnlyWhiteSpacesValidator()]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(3), notOnlyWhiteSpacesValidator()]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(3), notOnlyWhiteSpacesValidator()]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), notOnlyWhiteSpacesValidator()]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(3), notOnlyWhiteSpacesValidator()]),
      }),
      creditCard: this.formBuilder.group({
        cardType:  new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(3), notOnlyWhiteSpacesValidator()]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern(creditCardNumberPattern)]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern(creditCardSecurityCodePattern)]),
        expirationMonth:  new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required]),
      }),
    });

    //populate countries list
    this.shopFormService.getCountries().subscribe((data) => (this.countriesList = data));

    //populate credit card years and months
    const startMonth = new Date().getMonth() + 1;
    this.shopFormService.getCreditCardMonths(startMonth).subscribe((data) => (this.creditCardMonths = data));
    this.shopFormService.getCreditCardYears().subscribe((data) => (this.creditCardYears = data));
  }

  get firstName() {return this.checkoutFormGroup.get('customer.firstName');}
  get lastName() {return this.checkoutFormGroup.get('customer.lastName');}
  get email() {return this.checkoutFormGroup.get('customer.email');}

  get shippingStreet() {return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingCity() {return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingState() {return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingCountry() {return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingZipCode() {return this.checkoutFormGroup.get('shippingAddress.zipCode');}

  get billingStreet() {return this.checkoutFormGroup.get('billingAddress.street');}
  get billingCity() {return this.checkoutFormGroup.get('billingAddress.city');}
  get billingState() {return this.checkoutFormGroup.get('billingAddress.state');}
  get billingCountry() {return this.checkoutFormGroup.get('billingAddress.country');}
  get billingZipCode() {return this.checkoutFormGroup.get('billingAddress.zipCode');}


  get creditCardType() {return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardName() {return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber() {return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode() {return this.checkoutFormGroup.get('creditCard.securityCode');}
  get creditCardExpirationMonth() {return this.checkoutFormGroup.get('creditCard.expirationMonth');}
  get creditCardExpirationYear() {return this.checkoutFormGroup.get('creditCard.expirationYear');}
  


  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched;
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(item => new OrderItem(item));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingcountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingcountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingcountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingcountry.name;

    // populate purchase - order and order items
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via checkoutService
    this.checkouService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has been reveived.\nOrder tracking number: ${response.orderTrackingNumber}`);

          // reset cart
          this.resetCart();
        },
        error: error => {
          alert(`There was an error: ${error.message}`);
        }
      }
    )

  }


  reviewCartDetails() {

    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )
    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    )
  }


  resetCart() {
    // reset the cart
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    // redirect back to the products page
    this.router.navigateByUrl("/products");
  }


  copyShippingAddressToBillingAddress(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }


  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = creditCardFormGroup?.value.expirationYear;

    //if the current year equals the selectedY year, then start with the current month
    let startMonth: number = 1;

    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }

    this.shopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => (this.creditCardMonths = data));
  }


  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    this.shopFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else if (formGroupName === 'billingAddress') {
        this.billingAddressStates = data;
      }

      //set first value as default
      formGroup?.get('state')?.setValue(data[0]);
    });
  }
}

