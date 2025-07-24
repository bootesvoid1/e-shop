import { Component } from '@angular/core';
import { VariantService } from '../../../../core/services/variant.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';

@Component({
  selector: 'app-variants',
  standalone: false,
  templateUrl: './e-variant.component.html',
  styleUrl: './e-variant.component.scss',
})
export class VariantComponent {
  pageTitle: string = 'Variants';
  breadcrumb = [{ title: 'Admin' }, { title: 'Variants' }];
  tableCols: string[] = ['name', 'description', 'slug', 'actions'];
  tableColsName: string[] = ['Name', 'Description', 'Slug', 'Actions'];
  page: number = 1;
  limit: number = 5;
  totalPages: number = 0;
  tableData: any[] = [];
  // New Popup Trigger
  totalItems: number = 0;
  searchTerm: string | null = '';
  isConfirmOpen: boolean = false;
  selectedVariant!: any;
  constructor(
    private readonly variantService: VariantService,
    private readonly router: Router,
    private readonly toastrService: ToastrService
  ) {}
  ngOnInit(): void {
    this.getVariants({
      page: this.page,
      limit: this.limit,
      query: { searchTearm: '' },
    });
  }
  toggleClass(id?: string) {
    this.router.navigate([`admin/variants/${id ? id : '0'}`]);
  }

  getVariants(event?: {
    page: number;
    limit: number;
    query: { searchTearm: string };
  }) {
    this.variantService
      .findAll(event?.page ?? this.page, event?.limit ?? this.limit, {
        searchTerm: event?.query?.searchTearm ?? '',
      })
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.tableData = response.data;
          this.totalPages = Math.ceil(response.count / this.limit);
        },
      });
  }

  onSearch(event: string | null) {
    this.searchTerm = event;
    this.page = 1;

    this.getVariants({
      page: 1,
      limit: 5,
      query: { searchTearm: event ? event : '' },
    });
  }
  changePage(newPage: number) {
    this.page = newPage;
    this.getVariants({
      page: newPage,
      limit: this.limit,
      query: { searchTearm: this.searchTerm as string },
    });
  }
  delete() {
    this.variantService
      .delete(this.selectedVariant.id)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.toastrService.success('Category deleted succefully', 'Succès');
          this.closePopUp();
          this.getVariants({
            page: this.page,
            limit: this.limit,
            query: { searchTearm: '' },
          });
        },
        error: (error) => {
          this.toastrService.error('Category Deletion failed', 'Erreur');
          console.error('Create Error:', error);
        },
      });
  }
  openPopUp(item: any) {
    this.isConfirmOpen = true;
    this.selectedVariant = item;
  }
  closePopUp() {
    this.isConfirmOpen = false;
    this.selectedVariant = null;
  }
}
