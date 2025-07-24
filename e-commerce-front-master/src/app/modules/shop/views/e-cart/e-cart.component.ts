import { Component, OnInit } from '@angular/core';
import { Cartservice } from '../../../../core/services/cart.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-e-cart',
  standalone: false,
  templateUrl: './e-cart.component.html',
  styleUrl: './e-cart.component.scss',
})
export class ECartComponent implements OnInit {
  pageTitle: string = 'Cart';
  breadcrumb = [{ title: 'Shop' }, { title: 'Cart' }];
  tableCols: string[] = [];
  colsName: string[] = ['Product', 'Quantity', 'Price', 'Total'];

  cart: any;
  constructor(private readonly cartService: Cartservice) {}

  ngOnInit(): void {
    this.getCart();
  }

  getCart() {
    this.cartService
      .findOne()
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          this.cart = response;
        },
      });
  }

  getPriceWithoutDiscount() {
    return this.cart.items.reduce((acc: number, item: any) => {
      return acc + item.price * item.quantity;
    }, 0);
  }

  getTotalDiscountAmount(): number {
    return this.cart.items.reduce((acc: number, item: any) => {
      if (item.product?.discount) {
        const discountPerUnit = (item.price * item.product.discount) / 100;
        return acc + discountPerUnit * item.quantity;
      }
      return acc;
    }, 0);
  }

  getSubtotal(): number {
    return this.cart.items.reduce((acc: any, item: any) => {
      const discountedPrice = item.product?.discount
        ? item.price - (item.price * item.product.discount) / 100
        : item.price;
      return acc + discountedPrice * item.quantity;
    }, 0);
  }
  TAX_PERCENT = 19;

  getTax(): number {
    return (this.getSubtotal() * this.TAX_PERCENT) / 100;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax();
  }
}
