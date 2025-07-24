import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  standalone: false,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  @Input() buttonTitle: string = '';
  @Output() buttonClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() searchChanged = new EventEmitter<string | null>();
  constructor() {}

  onSearchChanged(value: any) {
    this.searchChanged.emit(value);
  }
  onClick() {
    this.buttonClicked.emit();
  }
}
