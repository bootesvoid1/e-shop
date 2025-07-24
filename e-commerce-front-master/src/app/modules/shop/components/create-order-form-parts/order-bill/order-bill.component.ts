import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-bill',
  standalone: false,
  templateUrl: './order-bill.component.html',
  styleUrl: './order-bill.component.scss',
})
export class OrderBillCardComponent {
  TAX_PERCENT = 19;

  @Input() items: any = [];
  getPriceWithoutDiscount() {
    return this.items.reduce((acc: number, item: any) => {
      return acc + item.price * item.quantity;
    }, 0);
  }

  getTotalDiscountAmount(): number {
    return this.items.reduce((acc: number, item: any) => {
      if (item.product?.discount) {
        const discountPerUnit = (item.price * item.product.discount) / 100;
        return acc + discountPerUnit * item.quantity;
      }
      return acc;
    }, 0);
  }

  getSubtotal(): number {
    return this.items.reduce((acc: any, item: any) => {
      const discountedPrice = item.product?.discount
        ? item.price - (item.price * item.product.discount) / 100
        : item.price;
      return acc + discountedPrice * item.quantity;
    }, 0);
  }

  getTax(): number {
    return (this.getSubtotal() * this.TAX_PERCENT) / 100;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax();
  }
}
