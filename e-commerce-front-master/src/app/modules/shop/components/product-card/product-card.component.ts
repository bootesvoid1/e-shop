import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardCompnent {
  @Input() item: any;
}
