import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { FeaturesService } from '../../../../core/services/features.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IFeatures } from '../../../../common/types/features/features';

@Component({
  selector: 'app-e-features',
  standalone: false,
  templateUrl: './e-features.component.html',
  styleUrl: './e-features.component.scss',
})
export class EFeaturesComponent implements OnInit {
  pageTitle: string = 'Categories';
  breadcrumb = [{ title: 'Admin' }, { title: 'Categories' }];
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
  selectedFeature!: any;
  constructor(
    private readonly featureService: FeaturesService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly toastrService: ToastrService
  ) {}
  ngOnInit(): void {
    this.getCategories({
      page: this.page,
      limit: this.limit,
      query: { searchTearm: '' },
    });
  }
  toggleClass(id?: string) {
    this.router.navigate([`admin/features/${id ? id : '0'}`]);
  }

  getCategories(event?: {
    page: number;
    limit: number;
    query: { searchTearm: string };
  }) {
    this.featureService
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

  createCategoryForm(data?: IFeatures) {
    return this.fb.group({
      name: [data && data.name ? data.name : '', [Validators.required]],
      description: [
        data && data.description ? data.description : '',
        [Validators.required],
      ],
    });
  }

  onSearch(event: string | null) {
    this.searchTerm = event;
    this.page = 1;

    this.getCategories({
      page: 1,
      limit: 5,
      query: { searchTearm: event ? event : '' },
    });
  }
  changePage(newPage: number) {
    this.page = newPage;
    this.getCategories({
      page: newPage,
      limit: this.limit,
      query: { searchTearm: this.searchTerm as string },
    });
  }
  delete() {
    this.featureService
      .delete(this.selectedFeature.id)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.toastrService.success('Category deleted succefully', 'Succès');
          this.closePopUp();
          this.getCategories({
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
    this.selectedFeature = item;
  }
  closePopUp() {
    this.isConfirmOpen = false;
    this.selectedFeature = null;
  }
}
