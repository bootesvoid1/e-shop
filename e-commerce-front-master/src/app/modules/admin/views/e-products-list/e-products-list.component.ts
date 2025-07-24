import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-e-products-list',
  standalone: false,
  templateUrl: './e-products-list.component.html',
  styleUrl: './e-products-list.component.scss',
})
export class EProductsListComponent implements OnInit {
  pageTitle: string = 'Products';
  breadcrumb = [{ title: 'Admin' }, { title: 'Products' }];
  page: number = 1;
  limit: number = 5;
  totalPages: number = 0;
  tableData: any[] = [];
  searchTerm: string | null = '';
  isConfirmOpen: boolean = false;
  selectedCategory!: any;
  tableCols: string[] = [
    'name',
    'category',
    'price',
    'stock',
    'discount',
    'actions',
  ];
  tableColsName: string[] = [
    'Product',
    'Category',
    'Price',
    'Stock',
    'Discount',
    'Actions',
  ];

  constructor(
    private readonly productService: ProductService,
    private readonly router: Router
  ) {}
  ngOnInit(): void {
    this.getProductPaginated();
  }
  // Tabs
  currentTab = 'tab1';
  switchTab(event: MouseEvent, tab: string) {
    event.preventDefault();
    this.currentTab = tab;
  }

  getProductPaginated(event?: {
    page: number;
    limit: number;
    query: { searchTearm: string };
  }) {
    this.productService
      .findAll(event?.page ?? this.page, event?.limit ?? this.limit, {
        searchTerm: event?.query?.searchTearm ?? '',
      })
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          this.tableData = response.data;
          this.totalPages = Math.ceil(response.count / this.limit);
        },
      });
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.getProductPaginated({
      page: newPage,
      limit: this.limit,
      query: { searchTearm: this.searchTerm as string },
    });
  }

  toggleClass(id?: string) {
    this.router.navigate([`admin/products/${id ? id : '0'}`]);
  }

  openPopUp(item: any) {
    this.isConfirmOpen = true;
    this.selectedCategory = item;
  }
  closePopUp() {
    this.isConfirmOpen = false;
    this.selectedCategory = null;
  }

  onSearch(event: string | null) {
    this.searchTerm = event;
    this.page = 1;

    this.getProductPaginated({
      page: 1,
      limit: 5,
      query: { searchTearm: event ? event : '' },
    });
  }
}
