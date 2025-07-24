import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-quantity-counter',
  standalone: false,

  templateUrl: './quantity-counter.component.html',
  styleUrl: './quantity-counter.component.scss',
})
export class QuantityCounterComponent {
  @Input() initialValue = 1;

  @Output() valueEmitter: EventEmitter<number> = new EventEmitter<number>();
  value = 1;

  ngOnInit() {
    this.value = this.initialValue;
  }

  increment() {
    this.value++;

    this.valueEmitter.emit(this.value);
  }

  decrement() {
    if (this.value > 1) {
      this.value--;
      this.valueEmitter.emit(this.value);
    }
  }
}
