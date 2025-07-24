import { NgModule } from '@angular/core';
import { MultipleFuComponent } from './multiple-fu/multiple-fu.component';
import { BreadCrumbComponent } from './breadcrumb/breadcrumb.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedTable } from './shared-table/shared-table.component';
import { CommonModule } from '@angular/common';
import { GlobalLoaderComponent } from './global-loader/global-loader.component';
import { FormError } from './formError/formError.component';
import { ConfirmModal } from './confirm-modal/confirm-modal.component';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RouterModule } from '@angular/router';
import { SearchFieldComponent } from './search-field/search-field.component';
import { PorductSortComponent } from './product-sort/product-sort.component';
import { PaginationComponent } from './pagination/pagination.component';
import { IconButtonComponent } from './icon-button/icon-button.component';

@NgModule({
  declarations: [
    MultipleFuComponent,
    BreadCrumbComponent,
    ToolbarComponent,
    SharedTable,
    GlobalLoaderComponent,
    FormError,
    ConfirmModal,
    Sidebar,
    Header,
    Footer,
    SearchFieldComponent,
    PorductSortComponent,
    PaginationComponent,
    IconButtonComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgScrollbarModule,
    RouterModule,
  ],
  exports: [
    MultipleFuComponent,
    BreadCrumbComponent,
    ToolbarComponent,
    SharedTable,
    GlobalLoaderComponent,
    FormError,
    ConfirmModal,
    Sidebar,
    Header,
    Footer,
    SearchFieldComponent,
    PorductSortComponent,
    PaginationComponent,
    IconButtonComponent,
  ],
})
export class SharedModule {}
