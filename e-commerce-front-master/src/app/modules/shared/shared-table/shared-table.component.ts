import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-shared-table',
  standalone: false,
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss'],
})
export class SharedTable {
  @Input() tableData: any[] = [];
  @Input() tableColsName: string[] = [];
  @Input() tableCols: string[] = [];

  @Input() page: number = 1;
  @Input() limit: number = 10;
  @Input() totalPages: number = 0;

  @Output() pageChange = new EventEmitter<number>();
  @Output() editClicked = new EventEmitter<any>();
  @Output() deleteClicked = new EventEmitter<any>();
  @Output() viewClicked = new EventEmitter<any>();

  changePage(newPage: number) {
    this.pageChange.emit(newPage);
  }

  edit(item: any) {
    this.editClicked.emit(item.id);
  }

  delete(item: any) {
    this.deleteClicked.emit(item);
  }

  view(item: any) {
    this.viewClicked.emit(item);
  }
}
