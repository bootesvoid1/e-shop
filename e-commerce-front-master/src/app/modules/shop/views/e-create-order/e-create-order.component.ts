import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cartservice } from '../../../../core/services/cart.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../../../core/services/order.service';

@Component({
  selector: 'app-e-create-order',
  standalone: false,
  templateUrl: './e-create-order.component.html',
  styleUrl: './e-create-order.component.scss',
})
export class ECreateOrderComponent implements OnInit {
  pageTitle = 'Create Order';

  breadcrumb = [{ title: 'Shop' }, { title: 'Create Order' }];

  orderForm!: FormGroup;
  cart: any;
  paymentMethods = [
    { label: 'Credit Card', value: 'card' },
    { label: 'PayPal', value: 'paypal' },
    { label: 'Cash on Delivery', value: 'cod' },
  ];

  selectedPayment: string = 'card'; // default value
  constructor(
    private readonly fb: FormBuilder,
    private readonly cartService: Cartservice,
    private readonly router: Router,
    private readonly toastrService: ToastrService,
    private readonly orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderForm = this.createOrderForm();
    this.getCart();
  }

  createOrderForm(data?: any) {
    return this.fb.group({
      userId: [data && data.userId ? data.userId : ''],
      totalAmount: [data && data.items ? this.getSubtotal() : 0],
      status: ['pending'],
      paymentMethod: [''],
      paymentStatus: ['unpaid'],
      items: this.fb.array(
        data && data.items.length
          ? data.items.map((item: any) => this.createOrderItems(item))
          : []
      ),
      shippingInfo: this.createShippingInfoForm(),
    });
  }

  get shippingInfo() {
    return this.orderForm.get('shippingInfo') as FormGroup;
  }

  createOrderItems(item: any) {
    return this.fb.group({
      productId: [item.productId],
      quantity: [item.quantity],
      price: [item.price],
      selectedVariants: [item.selectedVariants],
    });
  }

  createItemForm(data?: any) {
    return this.fb.group({
      productId: [data.productId],
      quantity: [data.quantity],
      price: [data.price],
      selectedVariants: [],
    });
  }
  createShippingInfoForm(data?: any) {
    return this.fb.group({
      firstName: [
        data && data.firstName ? data.firstName : '',
        [Validators.required],
      ],
      lastName: [
        data && data.lastName ? data.lastName : '',
        [Validators.required],
      ],
      email: [
        data && data.email ? data.email : '',
        [Validators.required, Validators.email],
      ],

      phone: [data && data.phone ? data.phone : '', [Validators.required]],
      city: [data && data.city ? data.city : '', [Validators.required]],
      ZipCode: [
        data && data.ZipCode ? data.ZipCode : '',
        [Validators.required],
      ],
      street: [data && data.street ? data.street : '', [Validators.required]],

      notes: [data && data.notes ? data.notes : ''],
    });
  }

  getCart() {
    this.cartService
      .findOne()
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          this.cart = response;

          this.orderForm = this.createOrderForm(response);
        },
        complete: () => {
          console.log(this.orderForm);
        },
      });
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax();
  }

  TAX_PERCENT = 19;

  getTax(): number {
    return (this.getSubtotal() * this.TAX_PERCENT) / 100;
  }

  getSubtotal(): number {
    return this.cart.items.reduce((acc: any, item: any) => {
      const discountedPrice = item.product?.discount
        ? item.price - (item.price * item.product.discount) / 100
        : item.price;
      return acc + discountedPrice * item.quantity;
    }, 0);
  }

  onClick(event: 'cancel' | 'confirm') {
    event === 'cancel' ? this.router.navigate(['/shop']) : this.onSubmit();
  }

  onSubmit() {
    if (this.orderForm.invalid) {
      console.log(this.orderForm.value);
      this.orderForm.markAllAsDirty();
      this.orderForm.markAllAsTouched();
      this.toastrService.error(
        'Veuillez corriger les erreurs du formulaire.',
        'Formulaire invalide'
      );
      return;
    }

    const payload = this.orderForm.value;

    this.orderService
      .create(payload)
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {},
      });
  }
}
