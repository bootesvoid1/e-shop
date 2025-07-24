import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-product-category-vendor',
  standalone: false,
  templateUrl: './product-category-vendor.component.html',
  styleUrl: './product-category-vendor.component.scss',
})
export class ProductCategoryVendorComponent {
  @Input() formGroup!: FormGroup;
  @Input() categories: any = [];
  @Input() Manufacturors: any = [];
}
