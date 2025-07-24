import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  standalone: false,
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadCrumbComponent {
  @Input() pageTitle: string = '';
  @Input() breadcrumb: { title: string }[] = [{ title: '' }];
}
