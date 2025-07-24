import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NominatimService } from '../../../../../core/services/nominatim.service';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-customer-info',
  standalone: false,
  templateUrl: './customer-info.component.html',
  styleUrl: './customer-info.component.scss',
})
export class CustomerInfoComponent implements OnInit {
  @Input() formGroup!: FormGroup;

  @Output() clickEmitter: EventEmitter<'cancel' | 'confirm'> = new EventEmitter<
    'cancel' | 'confirm'
  >();
  citySuggestions: any[] = [];
  isLoadingCities = false;
  cityInput$ = new Subject<string>();

  constructor(private readonly nominatimService: NominatimService) {}

  ngOnInit(): void {
    this.cityInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => (this.isLoadingCities = true)),
        switchMap((term: any) =>
          this.nominatimService
            .searchCities(term)
            .pipe(tap(() => (this.isLoadingCities = false)))
        )
      )
      .subscribe((res) => {
        this.citySuggestions = res;
      });
  }

  onCityInput(q: any) {
    const value = q.target.value;
    if (value.length < 2) return;
    this.nominatimService
      .searchCities(value)
      .subscribe((res) => (this.citySuggestions = res));
  }

  selectCity(c: any) {
    const control = this.formGroup?.get('city');
    if (control) {
      control.patchValue(c.display_name); // not { c } because patchValue expects the value directly
    }
    this.citySuggestions = [];
  }

  onClick(event: 'cancel' | 'confirm') {
    this.clickEmitter.emit(event);
  }
}
