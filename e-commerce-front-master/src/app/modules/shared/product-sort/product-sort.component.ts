import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-product-sort-filter',
  standalone: false,
  templateUrl: './product-sort.component.html',
  styleUrl: './product-sort.component.scss',
})
export class PorductSortComponent {
  isCardHeaderOpen = false;
  @Output() selectedFilterEmitter: EventEmitter<string> =
    new EventEmitter<string>();
  buttonsValues = [
    {
      label: 'Default Sorting',
      value: 'createdAt',
    },
    {
      label: 'Price Low to High',
      value: 'price_to_high',
    },
    {
      label: 'Price High to Low',
      value: 'price_to_low',
    },
  ];

  constructor(private readonly eRef: ElementRef) {}

  toggleCardHeaderMenu() {
    this.isCardHeaderOpen = !this.isCardHeaderOpen;
  }
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isCardHeaderOpen = false;
    }
  }

  onFilterSelected(value: string) {
    this.selectedFilterEmitter.emit(value);
  }
}
