import { PaymentInfo } from './../common/payment-info';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private httpClient: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<any>{
    const searchUrl = `${environment.api.url}/checkout/purchase`;
    return this.httpClient.post<Purchase>(searchUrl, purchase);
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any>{
    const searchUrl = `${environment.api.url}/checkout/payment-intent`;
    return this.httpClient.post<PaymentInfo>(searchUrl, paymentInfo);
  }
}
