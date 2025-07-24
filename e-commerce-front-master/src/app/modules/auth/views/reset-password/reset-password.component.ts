import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { take } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  //     resetForm!: FormGroup;
  //     constructor(
  //         public toggleService: ToggleService,
  //         private readonly fb: FormBuilder,
  //         private readonly authService: AuthService,
  //         private readonly router: Router
  //     ) {}
  //     ngOnInit(): void {
  //         // Initialize theme and direction on component load
  //         this.toggleService.initializeTheme();
  //         this.resetForm = this.createResetForm();
  //     }
  //     createResetForm(): FormGroup {
  //         return this.fb.group(
  //             {
  //                 token: ['',[Validators.required]],
  //                 password: ['', [Validators.required]],
  //                 confirmPassword: ['', [Validators.required]],
  //             },
  //             {
  //                 validators: this.passwordMatchValidator(),
  //             }
  //         );
  //     }
  //     // Toggle theme between light and dark
  //     toggleTheme() {
  //         this.toggleService.toggleTheme();
  //     }
  //     // Toggle direction between LTR and RTL
  //     toggleDirection() {
  //         this.toggleService.toggleDirection();
  //     }
  //     // Password Show/Hide
  //     password2: string = '';
  //     password3: string = '';
  //     isPassword2Visible: boolean = false;
  //     isPassword3Visible: boolean = false;
  //     togglePassword2Visibility(): void {
  //         this.isPassword2Visible = !this.isPassword2Visible;
  //     }
  //     togglePassword3Visibility(): void {
  //         this.isPassword3Visible = !this.isPassword3Visible;
  //     }
  //     onPassword2Input(event: Event): void {
  //         const inputElement = event.target as HTMLInputElement;
  //         this.password2 = inputElement.value;
  //     }
  //     onPassword3Input(event: Event): void {
  //         const inputElement = event.target as HTMLInputElement;
  //         this.password3 = inputElement.value;
  //     }
  //     passwordMatchValidator(): ValidatorFn {
  // return ((control: AbstractControl): ValidationErrors | null => {
  //     if (!(control instanceof FormGroup)) return null;
  //     const password = control.get('password')?.value;
  //     const confirmPassword = control.get('confirmPassword')?.value;
  //     return password === confirmPassword ? null : { passwordMismatch: true };
  // }) as ValidatorFn;
  //     }
  //     submit(){
  //         if(this.resetForm.valid){
  //             const { confirmPassword ,...rest} = this.resetForm.value;
  // this.authService.resetPassword(rest).pipe(take(1)).subscribe({
  //     next:(response:any)=>{
  //         this.router.navigate(['authentication/sign-in']);
  //     }
  // })
  //         }else{
  //             this.resetForm.markAllAsTouched()
  //             this.resetForm.markAsDirty();
  //         }
  //     }
}
