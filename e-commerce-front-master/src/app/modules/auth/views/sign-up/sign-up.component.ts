import { Component } from '@angular/core';
import { ToggleService } from '../../../../core/services/toggle.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/auth.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  signUpForm!: FormGroup;
  constructor(
    public toggleService: ToggleService,
    private readonly fb: FormBuilder,
    private readonly toastrService: ToastrService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // Initialize theme and direction on component load
    this.toggleService.initializeTheme();

    this.signUpForm = this.createSignupForm();
  }

  createSignupForm() {
    return this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      isTwoFactorEnabled: [false],
      address: [''],
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

  onSubmit(): void {
    console.log(this.signUpForm.value);

    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsDirty();
      this.signUpForm.markAllAsTouched();
      this.toastrService.error(
        'Veuillez corriger les erreurs du formulaire.',
        'Formulaire invalide'
      );
      return;
    }

    const formValue = this.signUpForm.value;

    this.authService
      .signUp(formValue)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.toastrService.success('Catégorie créée avec succès.', 'Succès');
          this.router.navigate(['authentication/sign-in']);
        },
        error: (error) => {
          this.toastrService.error(
            'Échec de la création de la catégorie.',
            'Erreur'
          );
          console.error('Create Error:', error);
        },
      });
  }
}
