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
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { notOnlyWhiteSpacesValidator } from 'src/app/common/shop-form-validators';
import { State } from 'src/app/common/state';
import { CheckoutService } from 'src/app/services/checkout.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  isPurchaseDisabled: boolean = false;
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countriesList: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  // Initialize Stripe API
  stripe = Stripe(environment.stripe.key.publishable);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  constructor(
    private formBuilder: FormBuilder,
    private shopFormService: ShopFormService,
    private cartService: CartService,
    private checkouService: CheckoutService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Setup Stripe Payment Form
    this.setupPaymentForm();

    this.reviewCartDetails();

    const emailPattern = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$';
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
      creditCard: this.formBuilder.group({})
    });

    //populate countries list
    this.shopFormService.getCountries().subscribe((data) => (this.countriesList = data));
  }


  onSubmit() {
    this.isPurchaseDisabled = true;
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
    let orderItems: OrderItem[] = cartItems.map(item => new OrderItem(item));

    // set up purchase
    let purchase = new Purchase();
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    console.log("shippingAddress: " + JSON.stringify(purchase.shippingAddress));
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

    // compute payment info: convert dollar to cents
    this.paymentInfo.amount = Math.round(this.totalPrice*100);
    this.paymentInfo.currency = "USD";
    this.paymentInfo.receiptEmail = purchase.customer.email;

    // if form valid
    // -create payment intent
    // -confirm card payment
    // -place order
    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {

      this.checkouService.createPaymentIntent(this.paymentInfo).subscribe(
        (response) => {
          this.stripe.confirmCardPayment(response.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address: {
                    line1: purchase.billingAddress.street,
                    city: purchase.billingAddress.city,
                    state: purchase.billingAddress.state,
                    postal_code: purchase.billingAddress.zipCode,
                    // needs to send country code and only from supported codes list
                    //country: purchase.billingAddress.country 
                  }
                }
              }
            }, { handleActions: false })
            .then((result: any) => {
              if (result.error) {
                // inform the user
                alert(`There was an error: ${result.error.message}`);
                this.isPurchaseDisabled = false;
              } else {
                // call REST API via checkout service
                this.checkouService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(`Your order has been received: \nOrder tracking number: ${response.orderTrackingNumber}`);

                    this.clearCart();
                    this.isPurchaseDisabled = false;
                  },
                  error: (error: any) => {
                    alert(`There was an error: ${error.message}`);
                    this.isPurchaseDisabled = false;
                  }
                });
              }
            })
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }

  setupPaymentForm() {
    var elements = this.stripe.elements();
    this.cardElement = elements.create('card', { hidePostalCode: true });

    this.cardElement.mount("#card-element");
    this.cardElement.on('change', (event: any) => {
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    })
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

  private clearCart() {
    // reset the cart
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();

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


  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
}

