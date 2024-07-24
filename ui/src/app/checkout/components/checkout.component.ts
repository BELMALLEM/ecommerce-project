import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../cart/services/cart.service';
import { ShopFormService } from '../services/shop-form.service';
import { CheckoutService } from 'src/app/checkout/services/checkout.service';
import { Country } from 'src/app/checkout/models/country';
import { Order } from 'src/app/checkout/models/order';
import { OrderItem } from 'src/app/checkout/models/order-item';
import { PaymentInfo } from 'src/app/checkout/models/payment-info';
import { Purchase } from 'src/app/checkout/models/purchase';
import { notOnlyWhiteSpacesValidator } from 'src/app/checkout/models/shop-form-validators';
import { State } from 'src/app/checkout/models/state';
import { environment } from 'src/environments/environment';
import { Address } from '../models/address';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  isPurchaseDisabled = false;
  checkoutFormGroup!: FormGroup;

  totalPrice = 0.0;
  totalQuantity = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countriesList: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  stripe = Stripe(environment.stripe.key.publishable);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";
  @ViewChild('creditCardErrors') cardErrorElement: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private shopFormService: ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupPaymentForm();
    this.reviewCartDetails();
    this.initCheckoutForm();
    this.populateCountries();
  }

  private initCheckoutForm(): void {
    const emailPattern = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$';
    const userEmail = JSON.parse(this.storage.getItem('userEmail'));

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(3), notOnlyWhiteSpacesValidator()]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(3), notOnlyWhiteSpacesValidator()]),
        email: new FormControl(userEmail, [Validators.required, Validators.pattern(emailPattern)]),
      }),
      shippingAddress: this.formBuilder.group(this.createAddressFormGroup()),
      billingAddress: this.formBuilder.group(this.createAddressFormGroup()),
      creditCard: this.formBuilder.group({}),
    });
  }

  private createAddressFormGroup(): any {
    return {
      street: new FormControl('', [Validators.required, Validators.minLength(3), notOnlyWhiteSpacesValidator()]),
      city: new FormControl('', [Validators.required, Validators.minLength(2), notOnlyWhiteSpacesValidator()]),
      state: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required, Validators.minLength(3), notOnlyWhiteSpacesValidator()]),
    };
  }

  private populateCountries(): void {
    this.shopFormService.getCountries().subscribe((data) => (this.countriesList = data));
  }

  onSubmit(): void {
    this.isPurchaseDisabled = true;

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    const purchase = this.preparePurchase();

    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (response) => this.handlePayment(response, purchase),
        (error) => this.handleError(error)
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }

  private preparePurchase(): Purchase {
    const purchase = new Purchase();
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.shippingAddress = this.populateAddress(this.checkoutFormGroup.controls['shippingAddress'].value);
    purchase.billingAddress = this.populateAddress(this.checkoutFormGroup.controls['billingAddress'].value);

    const order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;
    purchase.orderItems = cartItems.map(item => new OrderItem(item));
    purchase.order = order;

    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "USD";
    this.paymentInfo.receiptEmail = purchase.customer.email;

    return purchase;
  }

  private populateAddress(address: Address): any {
    const state: State = JSON.parse(JSON.stringify(address.state));
    const country: Country = JSON.parse(JSON.stringify(address.country));
    address.state = state.name;
    address.country = country.name;
    return address;
  }

  private handlePayment(response: any, purchase: Purchase): void {
    this.stripe.confirmCardPayment(response.client_secret, {
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
          },
        },
      },
    }, { handleActions: false }).then((result: any) => this.processPaymentResult(result, purchase));
  }

  private processPaymentResult(result: any, purchase: Purchase): void {
    if (result.error) {
      alert(`There was an error: ${result.error.message}`);
      this.isPurchaseDisabled = false;
    } else {
      this.checkoutService.placeOrder(purchase).subscribe({
        next: (response: any) => {
          alert(`Your order has been received: \nOrder tracking number: ${response.orderTrackingNumber}`);
          this.clearCart();
        },
        error: (error: any) => {
          alert(`There was an error: ${error.message}`);
          this.isPurchaseDisabled = false;
        },
      });
    }
  }

  private handleError(error: any): void {
    alert(`There was an error: ${error.message}`);
    this.isPurchaseDisabled = false;
  }

  private setupPaymentForm(): void {
    const elements = this.stripe.elements();
    this.cardElement = elements.create('card', { hidePostalCode: true });
    this.cardElement.mount("#card-element");
    this.cardElement.on('change', (event: any) => this.handleCardChange(event));
  }

  private handleCardChange(event: any): void {
    if(event.error){
      this.cardErrorElement.nativeElement.textContent = event.error.message;
    } else {
      this.cardErrorElement.nativeElement.textContent = "";
    }
  }

  private reviewCartDetails(): void {
    this.cartService.totalQuantity.subscribe((data) => (this.totalQuantity = data));
    this.cartService.totalPrice.subscribe((data) => (this.totalPrice = data));
  }

  private clearCart(): void {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl("/products");
  }

  copyShippingAddressToBillingAddress(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  getStates(formGroupName: string): void {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;

    this.shopFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }
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
