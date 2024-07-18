import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import appConfig from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private httpClient: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<any>{
    const searchUrl = `${appConfig.api.url}/checkout/purchase`;

    return this.httpClient.post<Purchase>(searchUrl, purchase);
  }
}
