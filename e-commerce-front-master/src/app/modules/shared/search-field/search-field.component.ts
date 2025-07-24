import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search-field',
  standalone: false,
  templateUrl: './search-field.component.html',
  styleUrl: './search-field.component.scss',
})
export class SearchFieldComponent implements OnInit {
  searchControl = new FormControl('');
  private readonly destroy$ = new Subject<void>();

  @Output() searchChanged = new EventEmitter<string | null>();

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((value: string | null) => {
        this.searchChanged.emit(value);
      });
  }
}
