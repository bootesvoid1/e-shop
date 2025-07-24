import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Admin } from './admin.component';
import { EProductsListComponent } from './views/e-products-list/e-products-list.component';
import { ECreateProductComponent } from './views/e-create-product/e-create-product.component';
import { EEditProductComponent } from './views/e-edit-product/e-edit-product.component';
import { EOrdersComponent } from './views/e-orders/e-orders.component';
import { ECustomersComponent } from './views/e-customers/e-customers.component';
import { ECustomerDetailsComponent } from './views/e-customer-details/e-customer-details.component';
import { ECategoriesComponent } from './views/e-categories/e-categories.component';
import { ESellersComponent } from './views/e-sellers/e-sellers.component';
import { ESellerDetailsComponent } from './views/e-seller-details/e-seller-details.component';
import { EFeaturesComponent } from './views/e-features/e-features.component';
import { ETagsComponent } from './views/e-tags/e-tags.component';
import { ECreateCategory } from './views/e-create-category/e-create-category.component';
import { ECreateFeature } from './views/e-create-feature/e-create-feature.component';
import { ECreateTag } from './views/e-create-tag/e-create-tag.component';

import { ECreateVendor } from './views/e-create-vendor/e-create-vendor.component';
import { EFVendorComponent } from './views/e-vendors/e-vendor.component';
import { VariantComponent } from './views/e-variants/e-variant.component';
import { CreateVariantComponent } from './views/e-create-variant/create-variant.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products-list' },
  {
    path: '',
    component: Admin,
    children: [
      {
        path: 'products',
        component: EProductsListComponent,
      },

      { path: 'edit-product', component: EEditProductComponent },
      { path: 'orders', component: EOrdersComponent },
      { path: 'customers', component: ECustomersComponent },
      {
        path: 'customer-details',
        component: ECustomerDetailsComponent,
      },
      { path: 'category', component: ECategoriesComponent },
      { path: 'variants', component: VariantComponent },

      { path: 'features', component: EFeaturesComponent },
      { path: 'tags', component: ETagsComponent },
      { path: 'vendors', component: EFVendorComponent },

      { path: 'sellers', component: ESellersComponent },
      {
        path: 'seller-details',
        component: ESellerDetailsComponent,
      },
      { path: 'category/:id', component: ECreateCategory },
      { path: 'features/:id', component: ECreateFeature },
      { path: 'tags/:id', component: ECreateTag },
      { path: 'variants/:id', component: CreateVariantComponent },

      { path: 'vendors/:id', component: ECreateVendor },
      {
        path: 'products/:id',
        component: ECreateProductComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
