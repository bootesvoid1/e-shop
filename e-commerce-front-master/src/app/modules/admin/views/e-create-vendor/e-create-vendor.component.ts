import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ManufacturorService } from '../../../../core/services/manufacturor.service';
import { IManufacturor } from '../../../../common/types/product';

@Component({
  selector: 'app-create-vendor',
  standalone: false,
  templateUrl: './e-create-vendor.component.html',
  styleUrl: './e-create-vendor.component.scss',
})
export class ECreateVendor implements OnInit {
  featureForm!: FormGroup;
  pageTitle = 'Create Vendor';
  breadcrumb = [{ title: 'Admin' }, { title: 'Create Vendor' }];
  featureId: string = '0';

  constructor(
    private readonly fb: FormBuilder,
    private readonly vendorService: ManufacturorService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadFeatureIfEditing();
  }

  private initForm(data?: IManufacturor): void {
    this.featureForm = this.fb.group({
      name: [data?.name ?? '', Validators.required],
      details: [data?.details ?? ''],
    });
  }

  private loadFeatureIfEditing(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.featureId = id as string;
      if (id && id !== '0') {
        this.vendorService
          .findOne(id)
          .pipe(take(1))
          .subscribe({
            next: (response: any) => {
              this.initForm(response);
            },
          });
      }
    });
  }

  onNavigateBack(): void {
    this.router.navigate(['admin/features']);
  }

  onSubmit(): void {
    if (this.featureForm.invalid) {
      this.featureForm.markAllAsDirty();
      this.featureForm.markAllAsTouched();
      this.toastrService.error(
        'Veuillez corriger les erreurs du formulaire.',
        'Formulaire invalide'
      );
      return;
    }

    const formValue = this.featureForm.value;

    if (this.featureId === '0') {
      // Create case
      this.vendorService
        .create(formValue)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.toastrService.success(
              'Catégorie créée avec succès.',
              'Succès'
            );
            this.onNavigateBack();
          },
          error: (error) => {
            this.toastrService.error(
              'Échec de la création de la catégorie.',
              'Erreur'
            );
            console.error('Create Error:', error);
          },
        });
    } else {
      // Update case
      this.vendorService
        .update(this.featureId, formValue)
        .pipe(take(1))
        .subscribe({
          next: (response: any) => {
            this.toastrService.success(
              'Catégorie mise à jour avec succès.',
              'Succès'
            );
            this.onNavigateBack();
          },
          error: (error) => {
            this.toastrService.error(
              'Échec de la mise à jour de la catégorie.',
              'Erreur'
            );
            console.error('Update Error:', error);
          },
        });
    }
  }
}
