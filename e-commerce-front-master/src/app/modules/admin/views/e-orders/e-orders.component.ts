import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-e-orders',
  standalone: false,
  templateUrl: './e-orders.component.html',
  styleUrl: './e-orders.component.scss',
})
export class EOrdersComponent implements OnInit {
  pageTitle: string = 'Categories';
  breadcrumb = [{ title: 'Admin' }, { title: 'Categories' }];

  orders: any[] = [];

  constructor(private readonly orderService: OrderService) {}
  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderService
      .findAll()
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          this.orders = response.data;
        },
      });
  }
}
