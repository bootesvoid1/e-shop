import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { EProductsGridComponent } from './views/e-products-grid/e-products-grid.component';
import { NgModule } from '@angular/core';
import { ShopComponent } from './shop.component';
import { EProductDetailsComponent } from './views/e-product-details/e-product-details.component';
import { ECartComponent } from './views/e-cart/e-cart.component';
import { ECreateOrderComponent } from './views/e-create-order/e-create-order.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products',
  },
  {
    path: '',
    component: ShopComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'products',
        component: EProductsGridComponent,
      },
      {
        path: 'cart',
        component: ECartComponent,
      },
      {
        path: 'create-order',
        component: ECreateOrderComponent,
      },
      {
        path: 'products/:id',
        component: EProductDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
