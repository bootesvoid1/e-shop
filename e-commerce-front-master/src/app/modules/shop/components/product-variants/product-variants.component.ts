import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-variant',
  standalone: false,
  templateUrl: './product-variants.component.html',
  styleUrls: ['./product-variants.component.scss'],
})
export class ProductVariantsComponent {
  @Input() variants: any[] = [];
  @Input() selectedPrice: { price: number; discount: number | null } = {
    price: 0,
    discount: null,
  };

  @Output() variantsCombinationsEmitter: EventEmitter<any> =
    new EventEmitter<any>();

  selectedValues: Record<number, any> = {};

  selectValue(variantId: number, value: any) {
    this.selectedValues[variantId] = value;
    this.variantsCombinationsEmitter.emit(this.selectedValues);
  }
}
