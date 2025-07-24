import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { take } from 'rxjs';
import { ToggleService } from '../../../../core/services/toggle.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-confirm-email',
  standalone: false,
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss',
})
export class ConfirmEmailComponent {
  constructor(
    private readonly fb: FormBuilder,
    public readonly toggleService: ToggleService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cookieService: CookieService
  ) {}
  confirmForm!: FormGroup;
  ngOnInit(): void {
    // Initialize theme and direction on component load
    this.toggleService.initializeTheme();
    this.confirmForm = this.createConfirmForm();
  }
  createConfirmForm(): FormGroup {
    const userId = localStorage.getItem('userId');
    return this.fb.group({
      id: [userId],
      code: ['', [Validators.required]],
    });
  }
  // Toggle theme between light and dark
  toggleTheme() {
    this.toggleService.toggleTheme();
  }
  // Toggle direction between LTR and RTL
  toggleDirection() {
    this.toggleService.toggleDirection();
  }
  submit() {
    if (this.confirmForm.valid) {
      this.authService
        .confirmEmail(this.confirmForm.value)
        .pipe(take(1))
        .subscribe({
          next: (response: any) => {
            this.cookieService.set('token', response.token, {
              expires: 1,
              path: '/',
            });
            this.cookieService.set('user', JSON.stringify(response.user), {
              path: '/',
            });
            this.router.navigate(['admin']);
            console.log(response, 'reponse');
          },
        });
    } else {
      console.log(this.confirmForm);
      this.confirmForm.markAllAsTouched();
      this.confirmForm.markAsDirty();
    }
  }
}
