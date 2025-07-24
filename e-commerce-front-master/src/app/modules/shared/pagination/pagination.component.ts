import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: false,
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() page: number = 1;
  @Input() totalPages: number = 1;
  @Input() limit: number = 10;
  @Input() totalItems: number = 0;
  @Input() currentDataLength: number = 0;
  @Input() pages: number[] = []; // optional if precomputed
  @Input() variant: 'table' | 'grid' = 'grid'; // switch between styles

  @Output() pageChange = new EventEmitter<number>();

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.pageChange.emit(page);
  }
}
