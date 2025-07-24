import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: false,
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModal {
  @Input() classApplied: boolean = false;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();
  toggleClass() {
    this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }
}
