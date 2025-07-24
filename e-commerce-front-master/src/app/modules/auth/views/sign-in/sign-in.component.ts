import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToggleService } from '../../../../core/services/toggle.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sign-in',
  standalone: false,

  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  signInForm!: FormGroup;
  constructor(
    public toggleService: ToggleService,
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly cookieService: CookieService
  ) {}
  ngOnInit(): void {
    // Initialize theme and direction on component load
    this.toggleService.initializeTheme();
    this.signInForm = this.createSignInForm();
  }
  // Toggle theme between light and dark
  toggleTheme() {
    this.toggleService.toggleTheme();
  }
  createSignInForm(): FormGroup {
    return this.fb.group({
      email: ['bhiri22@gmail.com', [Validators.required, Validators.email]],
      password: ['azerty', [Validators.required]],
    });
  }
  // Toggle direction between LTR and RTL
  toggleDirection() {
    this.toggleService.toggleDirection();
  }
  // Password Show/Hide
  password: string = '';
  isPasswordVisible: boolean = false;
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  onPasswordInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.password = inputElement.value;
  }
  onSubmit() {
    if (this.signInForm.valid) {
      const credentials = this.signInForm.value;
      this.authService.signIn(credentials).subscribe({
        next: (response: any) => {
          if (response.with2FA) {
            localStorage.setItem('userId', response.id);
            localStorage.setItem('userEmail', response.email);
            this.router.navigate(['authentication/confirm-email']);
          } else {
            this.cookieService.set('token', response.token, {
              expires: 1,
              path: '/',
            });
            this.cookieService.set('user', JSON.stringify(response.user), {
              path: '/',
            });
            const userRole = response.user.role;
            this.router.navigate([userRole === 'admin' ? 'admin' : 'shop']);
          }

          // this.router.navigate(['admin']);
        },
        error: (error) => {
          console.log(error);
        },
      });
    } else {
    }
  }
}
