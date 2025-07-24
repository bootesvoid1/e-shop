import { NgModule } from '@angular/core';
import { HomeComponent } from './views/home/home.component';
import { EProductsGridComponent } from './views/e-products-grid/e-products-grid.component';
import { ShopRoutingModule } from './shop.routing.module';
import { ShopComponent } from './shop.component';
import { SharedModule } from '../shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';
import { PdManageReviewsComponent } from './views/e-product-details/pd-manage-reviews/pd-manage-reviews.component';
import { QuantityCounterComponent } from './views/e-product-details/quantity-counter/quantity-counter.component';
import { EProductDetailsComponent } from './views/e-product-details/e-product-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductCarouselComponent } from './components/product-carousel/product-carousel.component';
import { ProductMainInformationsComponent } from './components/product-main-informations/product-main-informations.component';
import { ProductVariantsComponent } from './components/product-variants/product-variants.component';
import { ProductCardCompnent } from './components/product-card/product-card.component';
import { ECartComponent } from './views/e-cart/e-cart.component';
import { ECreateOrderComponent } from './views/e-create-order/e-create-order.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerInfoComponent } from './components/create-order-form-parts/customer-info/customer-info.component';
import { OrderBillCardComponent } from './components/create-order-form-parts/order-bill/order-bill.component';

@NgModule({
  declarations: [
    HomeComponent,
    EProductsGridComponent,
    ShopComponent,
    EProductDetailsComponent,
    PdManageReviewsComponent,
    QuantityCounterComponent,
    ProductCarouselComponent,
    ProductMainInformationsComponent,
    ProductVariantsComponent,
    ProductCardCompnent,
    ECartComponent,
    ECreateOrderComponent,
    CustomerInfoComponent,
    OrderBillCardComponent,
  ],
  imports: [
    ShopRoutingModule,
    SharedModule,
    CarouselModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  providers: [],
})
export class ShopModule {}
