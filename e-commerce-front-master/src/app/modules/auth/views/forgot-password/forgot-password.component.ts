import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { ToggleService } from '../../../../core/services/toggle.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  email: string = '';
  constructor(
    public toggleService: ToggleService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}
  ngOnInit(): void {
    this.toggleService.initializeTheme();
  }
  toggleTheme() {
    this.toggleService.toggleTheme();
  }
  toggleDirection() {
    this.toggleService.toggleDirection();
  }
  onSubmit() {
    const payload = { email: this.email };
    this.authService
      .forgotPassword(payload)
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          this.router.navigate(['authentication/reset-password']);
          console.log(response);
        },
      });
    console.log(payload); // Or call your API
  }
}
