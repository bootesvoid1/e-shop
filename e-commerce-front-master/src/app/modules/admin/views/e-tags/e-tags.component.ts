import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { ITags } from '../../../../common/types/tags/tags';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TagsService } from '../../../../core/services/tags.service';

@Component({
  selector: 'app-e-tags',
  standalone: false,
  templateUrl: './e-tags.component.html',
  styleUrl: './e-tags.component.scss',
})
export class ETagsComponent implements OnInit {
  pageTitle: string = 'Tags';
  breadcrumb = [{ title: 'Admin' }, { title: 'Tags' }];
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
  selectedTag!: any;
  constructor(
    private readonly tagService: TagsService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly toastrService: ToastrService
  ) {}
  ngOnInit(): void {
    this.getTag({
      page: this.page,
      limit: this.limit,
      query: { searchTearm: '' },
    });
  }
  toggleClass(id?: string) {
    this.router.navigate([`admin/tags/${id ? id : '0'}`]);
  }

  getTag(event?: {
    page: number;
    limit: number;
    query: { searchTearm: string };
  }) {
    this.tagService
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

    this.getTag({
      page: 1,
      limit: 5,
      query: { searchTearm: event ? event : '' },
    });
  }
  changePage(newPage: number) {
    this.page = newPage;
    this.getTag({
      page: newPage,
      limit: this.limit,
      query: { searchTearm: this.searchTerm as string },
    });
  }
  delete() {
    this.tagService
      .delete(this.selectedTag.id)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.toastrService.success('Category deleted succefully', 'Succès');
          this.closePopUp();
          this.getTag({
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
    this.selectedTag = item;
  }
  closePopUp() {
    this.isConfirmOpen = false;
    this.selectedTag = null;
  }
}
