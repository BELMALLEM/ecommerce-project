import { ShopFormService } from './../../services/shop-form.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Country } from 'src/app/common/country';
import { notOnlyWhiteSpacesValidator } from 'src/app/common/shop-form-validators';
import { State } from 'src/app/common/state';

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

  constructor(
    private formBuilder: FormBuilder,
    private shopFormService: ShopFormService
  ) {}

  ngOnInit(): void {
    const emailPattern = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9._%+-]{2,}[.][A-Za-z]{2,}$';
    const creditCardNumberPattern = '[0-9]{16}';
    const creditCardSecurityCodePattern = '[0-9]{3}';

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(3), notOnlyWhiteSpacesValidator()]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(3), notOnlyWhiteSpacesValidator()]),
        email: new FormControl('', [Validators.required, Validators.pattern(emailPattern)]),
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
    }
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

    console.log('currentYear: ' + currentYear);
    console.log('selectedYear: ' + selectedYear);

    //if the current year equals the selectedY year, then start with the current month
    let startMonth: number = 1;

    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }

    console.log('startMonth: ' + startMonth);

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
