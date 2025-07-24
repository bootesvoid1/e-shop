import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-carousel',
  standalone: false,
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.scss',
})
export class ProductCarouselComponent {
  @Input() productImages: any = [];
  @Input() selectedImage: string = '';

  changeImage(image: string) {
    this.selectedImage = image;
  }
}
