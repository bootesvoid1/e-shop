import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  standalone: false,
  templateUrl: './formError.component.html',
  styleUrl: './formError.component.scss',
})
export class FormError {
  @Input() control!: AbstractControl | null;
}
