import { ShopFormService } from './../../services/shop-form.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countriesList: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder, private shopFormService: ShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCardInformation: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    //populate countries list
    this.shopFormService.getCountries().subscribe(data => this.countriesList = data);

    //populate credit card years and months
    const startMonth = new Date().getMonth() + 1;
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(data => this.creditCardMonths = data);
    this.shopFormService.getCreditCardYears().subscribe(data => this.creditCardYears = data);
  }

  onSubmit(){
    console.log(this.checkoutFormGroup.get('customer')?.value);
  }

  copyShippingAddressToBillingAddress(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if(inputElement.checked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value)
      this.billingAddressStates = this.shippingAddressStates;
    }else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCardInformation');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = creditCardFormGroup?.value.expirationYear;

    console.log("currentYear: "+currentYear);
    console.log("selectedYear: "+selectedYear);

    //if the current year equals the selectedY year, then start with the current month
    let startMonth: number = 1;

    if(currentYear == selectedYear){
      startMonth = new Date().getMonth() + 1;
    }

    console.log("startMonth: "+startMonth);

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(data => this.creditCardMonths = data);
  }

  
  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }else if(formGroupName === 'billingAddress'){
          this.billingAddressStates = data;
        }

        //set first value as default
        formGroup?.get('state')?.setValue(data[0]);
      } 
    )
  }
  
}
