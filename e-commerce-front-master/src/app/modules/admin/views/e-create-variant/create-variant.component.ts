import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VariantService } from '../../../../core/services/variant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IVariant } from '../../../../common/types/product';
import { take } from 'rxjs';

@Component({
  selector: 'app-create-variant',
  standalone: false,
  templateUrl: './create-variant.component.html',
  styleUrl: './create-variant.component.scss',
})
export class CreateVariantComponent implements OnInit {
  variantForm!: FormGroup;
  pageTitle = 'Create  Variant';
  breadcrumb = [{ title: 'Admin' }, { title: 'Create  Varians' }];
  variantId: string = '0';

  constructor(
    private readonly fb: FormBuilder,
    private readonly variantService: VariantService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadVariantsIfEditing();
  }

  private initForm(data?: IVariant) {
    this.variantForm = this.fb.group({
      name: [data?.name ?? '', Validators.required],
      label: [data?.label ?? '', Validators.required],
      values: this.fb.array(
        data && data.values
          ? data.values.map((item) => this.createValuesForm(item))
          : []
      ),
    });
  }

  get valuesControls() {
    return (this.variantForm.get('values') as FormArray).controls;
  }

  createValuesForm(item: any) {
    return this.fb.group({
      label: [item.label],
    });
  }

  loadVariantsIfEditing() {
    this.activatedRoute.paramMap.pipe(take(1)).subscribe((params) => {
      const id = params.get('id');
      this.variantId = id as string;
      if (id && id !== '0') {
        this.variantService
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
    this.router.navigate(['admin/variants']);
  }
  removeValue(index: number) {
    (this.variantForm.get('values') as FormArray).removeAt(index);
  }
  addValue() {
    (this.variantForm.get('values') as FormArray).push(
      this.fb.group({
        label: ['', Validators.required],
      })
    );
  }

  onSubmit(): void {
    if (this.variantForm.invalid) {
      this.variantForm.markAllAsDirty();
      this.variantForm.markAllAsTouched();
      this.toastrService.error(
        'Veuillez corriger les erreurs du formulaire.',
        'Formulaire invalide'
      );
      return;
    }

    const formValue = this.variantForm.value;

    if (this.variantId === '0') {
      // Create case
      this.variantService
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
      this.variantService
        .update(this.variantId, formValue)
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
