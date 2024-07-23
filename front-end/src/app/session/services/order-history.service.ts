import { Order } from '../../checkout/models/order';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderHistory } from '../models/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  constructor(private httpClient: HttpClient) { }

  getUserOrderHistory(email: string): Observable<GetResponseOrderHistory>{

    const searchUrl = `${environment.api.url}/orders/search/customer?email=${email}`;
    return this.httpClient.get<GetResponseOrderHistory>(searchUrl);
  }
}

interface GetResponseOrderHistory{
  _embedded: {
    orders: OrderHistory[];
  }
}
