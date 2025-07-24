import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-variants',
  standalone: false,
  templateUrl: './product-variant.component.html',
  styleUrl: './product-variant.component.scss',
})
export class ProductVariants {
  variantTypes: string[] = ['text', 'color'];

  @Input() formGroup!: FormGroup;
  openSectionIndex: number = 0;

  constructor(private readonly fb: FormBuilder) {}
  isSectionOpen(index: number): boolean {
    return this.openSectionIndex === index;
  }
  toggleSection(index: number): void {
    if (this.openSectionIndex === index) {
      this.openSectionIndex = -1;
    } else {
      this.openSectionIndex = index;
    }
  }

  get variants(): FormArray {
    return this.formGroup.get('variants') as FormArray;
  }
  get features(): FormArray {
    return this.formGroup.get('features') as FormArray;
  }
  get tags(): FormArray {
    return this.formGroup.get('tags') as FormArray;
  }
  get specificationGroups(): FormArray {
    return this.formGroup.get('specificationGroups') as FormArray;
  }

  removeVariant(index: number) {
    this.variants.removeAt(index);
  }
  removeSpec(index: number) {
    this.specificationGroups.removeAt(index);
  }

  getVariantValuesControls(index: number): FormGroup[] {
    const variantGroup = this.variants.at(index) as FormGroup;
    const values = variantGroup.get('values') as FormArray;
    return values.controls as FormGroup[];
  }

  getSpecificationsValuesControls(index: number): FormGroup[] {
    const specGroup = this.specificationGroups.at(index) as FormGroup;
    const specifications = specGroup.get('specifications') as FormArray;
    return specifications.controls as FormGroup[];
  }

  removeValue(variantIndex: number, valueIndex: number) {
    const values = this.variants.at(variantIndex).get('values') as FormArray;
    values.removeAt(valueIndex);
  }

  addValue(index: number) {
    const values = this.variants.at(index).get('values') as FormArray;
    values.push(this.fb.group({ label: ['', Validators.required] }));
  }

  addVariant() {
    this.variants.push(this.createVariantForm());
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
  addFeature() {
    this.features.push(this.createTagForm());
  }

  createTagForm(tag?: any) {
    return this.fb.group({
      name: [tag.name ?? '', [Validators.required]],
      description: [tag.description ?? '', [Validators.required]],
    });
  }
}
