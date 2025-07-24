import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

import { IImageKit } from '../../../../common/types/image-kit';
import { ICateogry } from '../../../../common/types/category/category';
import { Category } from '../../../../core/services/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-category',
  standalone: false,
  templateUrl: './e-create-category.component.html',
  styleUrls: ['./e-create-category.component.scss'],
})
export class ECreateCategory implements OnInit {
  categoryForm!: FormGroup;
  pageTitle = 'Categories';
  breadcrumb = [{ title: 'Admin' }, { title: 'Categories' }];
  categoryId: string = '0';

  constructor(
    private readonly fb: FormBuilder,
    private readonly categoryService: Category,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategoryIfEditing();
  }

  private initForm(data?: ICateogry): void {
    this.categoryForm = this.fb.group({
      name: [data?.name ?? '', Validators.required],
      description: [data?.description ?? ''],
      slug: [data?.slug ?? '', Validators.required],
      document: [data?.document ?? ''],
    });
  }

  private loadCategoryIfEditing(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.categoryId = id as string;
      if (id && id !== '0') {
        this.categoryService
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
    this.router.navigate(['admin/category']);
  }

  onFileSelected(file: IImageKit): void {
    this.categoryForm.patchValue({
      document: { label: file.fileId, url: file.url },
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsDirty();
      this.categoryForm.markAllAsTouched();
      this.toastrService.error(
        'Veuillez corriger les erreurs du formulaire.',
        'Formulaire invalide'
      );
      return;
    }

    const formValue = this.categoryForm.value;

    if (this.categoryId === '0') {
      // Create case
      this.categoryService
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
      this.categoryService
        .update(this.categoryId, formValue)
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
