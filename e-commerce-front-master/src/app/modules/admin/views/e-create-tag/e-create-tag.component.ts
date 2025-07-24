import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

import { IImageKit } from '../../../../common/types/image-kit';

import { ToastrService } from 'ngx-toastr';
import { TagsService } from '../../../../core/services/tags.service';
import { ITags } from '../../../../common/types/tags/tags';

@Component({
  selector: 'app-create-tag',
  standalone: false,
  templateUrl: './e-create-tag.component.html',
  styleUrls: ['./e-create-tag.component.scss'],
})
export class ECreateTag implements OnInit {
  tagForm!: FormGroup;
  pageTitle = 'Tags';
  breadcrumb = [{ title: 'Admin' }, { title: 'Tags' }];
  tagId: string = '0';

  constructor(
    private readonly fb: FormBuilder,
    private readonly tagService: TagsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategoryIfEditing();
  }

  private initForm(data?: ITags): void {
    this.tagForm = this.fb.group({
      name: [data?.name ?? '', Validators.required],
      description: [data?.description ?? ''],
    });
  }

  private loadCategoryIfEditing(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.tagId = id as string;
      if (id && id !== '0') {
        this.tagService
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
    this.router.navigate(['admin/tags']);
  }

  onFileSelected(file: IImageKit): void {
    this.tagForm.patchValue({
      document: { label: file.fileId, url: file.url },
    });
  }

  onSubmit(): void {
    if (this.tagForm.invalid) {
      this.tagForm.markAllAsDirty();
      this.tagForm.markAllAsTouched();
      this.toastrService.error(
        'Veuillez corriger les erreurs du formulaire.',
        'Formulaire invalide'
      );
      return;
    }

    const formValue = this.tagForm.value;

    if (this.tagId === '0') {
      // Create case
      this.tagService
        .create(formValue)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.toastrService.success('Tag créée avec succès.', 'Succès');
            this.onNavigateBack();
          },
          error: (error) => {
            this.toastrService.error(
              'Échec de la création de la Tag.',
              'Erreur'
            );
            console.error('Create Error:', error);
          },
        });
    } else {
      // Update case
      this.tagService
        .update(this.tagId, formValue)
        .pipe(take(1))
        .subscribe({
          next: (response: any) => {
            this.toastrService.success(
              'Tag mise à jour avec succès.',
              'Succès'
            );
            this.onNavigateBack();
          },
          error: (error) => {
            this.toastrService.error(
              'Échec de la mise à jour de la Tag.',
              'Erreur'
            );
            console.error('Update Error:', error);
          },
        });
    }
  }
}
