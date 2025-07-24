import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IImageKit } from '../../../../common/types/image-kit';
import { take } from 'rxjs';
import { IFeatures } from '../../../../common/types/features/features';
import { FeaturesService } from '../../../../core/services/features.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-feature',
  standalone: false,
  templateUrl: './e-create-feature.component.html',
  styleUrl: './e-create-feature.component.scss',
})
export class ECreateFeature implements OnInit {
  featureForm!: FormGroup;
  pageTitle = 'Features';
  breadcrumb = [{ title: 'Admin' }, { title: 'Features' }];
  featureId: string = '0';

  constructor(
    private readonly fb: FormBuilder,
    private readonly featureService: FeaturesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadFeatureIfEditing();
  }

  private initForm(data?: IFeatures): void {
    this.featureForm = this.fb.group({
      name: [data?.name ?? '', Validators.required],
      description: [data?.description ?? ''],
    });
  }

  private loadFeatureIfEditing(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.featureId = id as string;
      if (id && id !== '0') {
        this.featureService
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

  onFileSelected(file: IImageKit): void {
    this.featureForm.patchValue({
      document: { label: file.fileId, url: file.url },
    });
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
      this.featureService
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
      this.featureService
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
