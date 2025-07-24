import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-e-seller-details',
  standalone: false,
  templateUrl: './e-seller-details.component.html',
  styleUrl: './e-seller-details.component.scss',
})
export class ESellerDetailsComponent {
  // Card Header Menu
  isCardHeaderOpen = false;
  toggleCardHeaderMenu() {
    this.isCardHeaderOpen = !this.isCardHeaderOpen;
  }
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.trezo-card-dropdown')) {
      this.isCardHeaderOpen = false;
    }
  }
}
