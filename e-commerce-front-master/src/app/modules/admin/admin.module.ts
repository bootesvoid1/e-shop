import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Admin } from './admin.component';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { ECategoriesComponent } from './views/e-categories/e-categories.component';
import { ECreateProductComponent } from './views/e-create-product/e-create-product.component';
import { NgxEditorModule } from 'ngx-editor';
import { ECustomerDetailsComponent } from './views/e-customer-details/e-customer-details.component';
import { ECustomersComponent } from './views/e-customers/e-customers.component';
import { EEditProductComponent } from './views/e-edit-product/e-edit-product.component';
import { EOrdersComponent } from './views/e-orders/e-orders.component';
import { DraftComponent } from './views/e-products-list/draft/draft.component';
import { PublishedComponent } from './views/e-products-list/published/published.component';
import { EProductsListComponent } from './views/e-products-list/e-products-list.component';
import { PublishedProductComponent } from './views/e-seller-details/products/published/published.component';
import { DraftProductComponent } from './views/e-seller-details/products/draft/draft.component';
import { ProductsComponent } from './views/e-seller-details/products/products.component';
import { ESellersComponent } from './views/e-sellers/e-sellers.component';
import { ESellerDetailsComponent } from './views/e-seller-details/e-seller-details.component';
import { SellerOverviewComponent } from './views/e-seller-details/seller-overview/seller-overview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EFeaturesComponent } from './views/e-features/e-features.component';
import { ETagsComponent } from './views/e-tags/e-tags.component';
import { SharedModule } from '../shared/shared.module';
import { ECreateCategory } from './views/e-create-category/e-create-category.component';
import { ECreateFeature } from './views/e-create-feature/e-create-feature.component';
import { ECreateTag } from './views/e-create-tag/e-create-tag.component';
import { ECreateVendor } from './views/e-create-vendor/e-create-vendor.component';
import { EFVendorComponent } from './views/e-vendors/e-vendor.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { VariantComponent } from './views/e-variants/e-variant.component';
import { AdminRoutingModule } from './admin.routing.module';
import { CreateVariantComponent } from './views/e-create-variant/create-variant.component';
import { MainInformationsComponent } from './components/product-form-parts/product-main-informations/main-informations.component';
import { ProductCategoryVendorComponent } from './components/product-form-parts/product-category-vendor/product-category-vendor.component';
import { ProductVariants } from './components/product-form-parts/product-variants/product-variant.component';

@NgModule({
  declarations: [
    Admin,
    ECategoriesComponent,
    ECreateProductComponent,
    ECustomerDetailsComponent,
    ECustomersComponent,
    EEditProductComponent,
    EOrdersComponent,
    DraftComponent,
    PublishedComponent,
    EProductsListComponent,
    DraftComponent,
    PublishedProductComponent,
    DraftProductComponent,
    ProductsComponent,
    ESellersComponent,
    ESellerDetailsComponent,
    SellerOverviewComponent,
    EFeaturesComponent,
    ETagsComponent,
    ECreateCategory,
    ECreateFeature,
    ECreateTag,
    MainInformationsComponent,
    ProductVariants,
    ProductCategoryVendorComponent,

    ECreateVendor,
    EFVendorComponent,
    VariantComponent,
    CreateVariantComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgScrollbarModule,
    NgxEditorModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule,
  ],
})
export class AdminModule {}
