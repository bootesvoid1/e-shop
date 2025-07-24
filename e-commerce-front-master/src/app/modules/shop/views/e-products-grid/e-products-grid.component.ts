import { Component, HostListener, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-e-products-grid',
  standalone: false,
  templateUrl: './e-products-grid.component.html',
  styleUrl: './e-products-grid.component.scss',
})
export class EProductsGridComponent implements OnInit {
  pageTitle: string = 'Products';
  breadcrumb = [{ title: 'Shop' }, { title: 'Products' }];

  // Card Header Menu
  isCardHeaderOpen = false;
  toggleCardHeaderMenu(value: boolean) {
    this.isCardHeaderOpen = value;
  }
  page: number = 1;
  limit: number = 9;
  totalPages: number = 0;
  pages: number[] = [];
  searchTerm: string | null = '';

  products: any = [];
  selectedSort: string = 'createdAt';

  constructor(private readonly productService: ProductService) {}
  ngOnInit(): void {
    this.getProductPaginated();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.trezo-card-dropdown')) {
      this.isCardHeaderOpen = false;
    }
  }

  getProductPaginated(event?: {
    page: number;
    limit: number;
    query: { searchTearm: string; sort: string };
  }) {
    this.productService
      .findAll(event?.page ?? this.page, event?.limit ?? this.limit, {
        searchTerm: event?.query?.searchTearm ?? '',
        sort: event?.query.sort ?? this.selectedSort,
      })
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          this.totalPages = Math.ceil(response.count / this.limit);
          this.products = response.data;
          const count = response.count;
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        },
      });
  }

  goToPage(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.page = newPage;
    this.getProductPaginated({
      page: newPage,
      limit: this.limit,
      query: {
        searchTearm: this.searchTerm as string,
        sort: this.selectedSort,
      },
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event;
    this.page = 1;

    this.getProductPaginated({
      page: 1,
      limit: 5,
      query: { searchTearm: event ? event : '', sort: this.selectedSort },
    });
  }

  onFilterSelected(value: string) {
    this.selectedSort = value;
    this.page = 1;
    this.getProductPaginated({
      page: 1,
      limit: this.limit,
      query: {
        searchTearm: this.searchTerm ?? '',
        sort: value,
      },
    });
  }
}
