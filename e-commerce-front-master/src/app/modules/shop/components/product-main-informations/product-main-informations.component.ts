import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-main-informations',
  standalone: false,
  templateUrl: './product-main-informations.component.html',
  styleUrl: './product-main-informations.component.scss',
})
export class ProductMainInformationsComponent {
  @Input() stock: any;
  @Input() title: string = '';
}
