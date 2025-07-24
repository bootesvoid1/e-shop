import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  standalone: false,
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
})
export class IconButtonComponent {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Output() clickEmitter: EventEmitter<void> = new EventEmitter<void>();

  onClick() {
    this.clickEmitter.emit();
  }
}
