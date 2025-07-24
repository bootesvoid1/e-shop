import { Component, OnInit } from '@angular/core';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Category } from '../../../../core/services/category.service';
import { take } from 'rxjs';
import { ManufacturorService } from '../../../../core/services/manufacturor.service';
import { ProductService } from '../../../../core/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IImageKit } from '../../../../common/types/image-kit';

@Component({
  selector: 'app-e-create-product',
  standalone: false,
  templateUrl: './e-create-product.component.html',
  styleUrl: './e-create-product.component.scss',
})
export class ECreateProductComponent implements OnInit {
  pageTitle = 'Create product';
  breadcrumb = [{ title: 'Admin' }, { title: 'Create Product' }];
  productForm!: FormGroup;
  categories: any[] = [];
  Manufacturors: any[] = [];
  status: string[] = ['active', 'inactive', 'archived'];
  productId: string = '0';

  constructor(
    private readonly fb: FormBuilder,
    private readonly categoryService: Category,
    private readonly manufacturorService: ManufacturorService,
    private readonly productService: ProductService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly toastrService: ToastrService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.getManufacturors();
    this.initForm();
    this.loadFeatureIfEditing();
  }
  private loadFeatureIfEditing(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.productId = id as string;
      if (id && id !== '0') {
        this.productService
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

  initForm(data?: any) {
    this.productForm = this.fb.group({
      mainInfo: this.fb.group({
        name: [data?.name ?? '', Validators.required],
        displayTitle: [data?.displayTitle ?? ''],
        SKU: [data?.SKU ?? '', Validators.required],
        status: [data?.status ?? 'active', Validators.required],
        price: [data?.price ?? '', Validators.required],
        stock: [data?.stock ?? '', Validators.required],
        userId: [data?.userId ?? ''],
        discount: [data?.discount ?? ''],
        description: [data?.description ?? '', Validators.required],
      }),

      categoryVendor: this.fb.group({
        categoryId: [data?.category?.id ?? '', Validators.required],
        manufacturerId: [data?.manufacturer?.id ?? '', Validators.required],
      }),

      documents: this.fb.array(
        data?.documents?.map((d: any) => this.createDocumentForm(d)) ?? []
      ),

      variantsSection: this.initVariantsSection(data),
    });
  }
  initVariantsSection(data?: any) {
    return this.fb.group({
      variants: this.fb.array(
        data?.variants?.map((v: any) => this.createVariantForm(v.variant)) ?? [
          this.createVariantForm(),
        ]
      ),
      tags: this.fb.array(
        data?.tags?.map((tag: any) => this.createTagForm(tag)) ?? [
          this.createTagForm(),
        ]
      ),
      features: this.fb.array(
        data?.features?.map((f: any) => this.createTagForm(f)) ?? [
          this.createTagForm(),
        ]
      ),

      specificationGroups: this.fb.array(
        data?.specificationGroups?.map((f: any) =>
          this.createSpecificationsGroup(f)
        ) ?? [this.createSpecificationsGroup()]
      ),
    });
  }
  get mainInfo(): FormGroup {
    return this.productForm.get('mainInfo') as FormGroup;
  }
  get categoryVendor(): FormGroup {
    return this.productForm.get('categoryVendor') as FormGroup;
  }

  get variantsSection(): FormGroup {
    return this.productForm.get('variantsSection') as FormGroup;
  }

  createVariantForm(variant?: any): FormGroup {
    return this.fb.group({
      name: [variant?.name || '', Validators.required],
      label: [variant?.label || '', Validators.required],
      type: [variant?.type || 'text'],
      values: this.fb.array(
        variant?.values?.length
          ? variant.values.map((v: any) =>
              this.fb.group({ label: [v.label || '', Validators.required] })
            )
          : [this.fb.group({ label: ['', Validators.required] })]
      ),
    });
  }
  createTagForm(tag?: any) {
    return this.fb.group({
      name: [tag && tag.name ? tag.name : '', [Validators.required]],
      description: [
        tag && tag.description ? tag.description : '',
        [Validators.required],
      ],
    });
  }
  createSpecificationsGroup(value?: any) {
    return this.fb.group({
      name: [value && value.name ? value.name : '', [Validators.required]],
      specifications: this.fb.array(
        value?.specifications?.map((f: any) =>
          this.createSpecifications(f)
        ) ?? [this.createSpecifications()]
      ),
    });
  }

  createSpecifications(value?: any) {
    return this.fb.group({
      label: [value && value.label ? value.label : '', [Validators.required]],
      value: [value && value.value ? value.value : '', [Validators.required]],
    });
  }

  createDocumentForm(item: any): FormGroup {
    return this.fb.group({
      label: [item.label, Validators.required],
      url: [item.url, Validators.required],
    });
  }

  getCategories() {
    this.categoryService
      .findUnpaginated()
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          this.categories = response;
        },
      });
  }

  getManufacturors() {
    this.manufacturorService
      .findUnpaginated()
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          this.Manufacturors = response;
        },
      });
  }

  onNavigateBack(): void {
    this.router.navigate(['admin/products']);
  }

  onSubmit(): void {
    console.log(this.productForm.value);

    if (this.productForm.invalid) {
      this.productForm.markAllAsDirty();
      this.productForm.markAllAsTouched();
      this.toastrService.error(
        'Veuillez corriger les erreurs du formulaire.',
        'Formulaire invalide'
      );
      return;
    }

    const formValue = this.productForm.value;
    const formRaw = this.productForm.getRawValue();
    const paylod = {
      ...formRaw.mainInfo,
      ...formRaw.categoryVendor,
      ...formRaw.variantsSection,
      documents: formRaw.documents,
    };

    if (this.productId === '0') {
      // Create case
      this.productService
        .create(paylod)
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
      this.productService
        .update(this.productId, paylod)
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
  onFileSelected(file: IImageKit): void {
    const control = this.productForm.get('documents') as FormArray;
    control.push(this.patchDocumentForm(file));
  }

  patchDocumentForm(item: IImageKit): FormGroup {
    return this.fb.group({
      label: [item.fileId, Validators.required],
      url: [item.url, Validators.required],
    });
  }
}
