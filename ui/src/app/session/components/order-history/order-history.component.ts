import { OrderHistory } from '../../models/order-history';
import { OrderHistoryService } from '../../services/order-history.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    const email = JSON.parse(this.storage.getItem('userEmail'));

    this.orderHistoryService.getUserOrderHistory(email).subscribe(data => {
      this.orderHistoryList = data._embedded.orders;
      console.log("orders: " + JSON.stringify(this.orderHistoryList));
    });

  }

}
