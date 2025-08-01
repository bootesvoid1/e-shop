import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private requestCount = 0;
  private readonly _isLoading = new BehaviorSubject<boolean>(false);
  readonly isLoading$ = this._isLoading.asObservable();

  show(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this._isLoading.next(true);
    }
  }

  hide(): void {
    this.requestCount--;
    if (this.requestCount === 0) {
      this._isLoading.next(false);
    }
  }

  reset(): void {
    this.requestCount = 0;
    this._isLoading.next(false);
  }
}
