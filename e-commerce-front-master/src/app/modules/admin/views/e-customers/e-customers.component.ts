import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-e-customers',
  standalone: false,
  templateUrl: './e-customers.component.html',
  styleUrl: './e-customers.component.scss',
})
export class ECustomersComponent implements OnInit {
  pageTitle: string = 'Categories';
  breadcrumb = [{ title: 'Admin' }, { title: 'Categories' }];
  tableCols: string[] = ['firstName', 'lastName', 'email', 'phoneNumber'];
  tableColsName: string[] = [
    'First Name',
    'Last Name',
    'Email',
    'phone Number',
  ];
  page: number = 1;
  limit: number = 5;
  totalPages: number = 0;
  tableData: any[] = [];
  // New Popup Trigger
  totalItems: number = 0;
  searchTerm: string | null = '';
  // Card Header Menu
  isCardHeaderOpen = false;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.getUsers({
      page: this.page,
      limit: this.limit,
      query: { searchTearm: '' },
    });
  }

  getUsers(event?: {
    page: number;
    limit: number;
    query: { searchTearm: string };
  }) {
    this.authService
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
  toggleCardHeaderMenu() {
    this.isCardHeaderOpen = !this.isCardHeaderOpen;
  }
  changePage(newPage: number) {
    this.page = newPage;
    this.getUsers({
      page: newPage,
      limit: this.limit,
      query: { searchTearm: this.searchTerm as string },
    });
  }
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.trezo-card-dropdown')) {
      this.isCardHeaderOpen = false;
    }
  }
}
