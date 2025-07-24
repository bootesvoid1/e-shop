import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-e-edit-product',
  standalone: false,
  templateUrl: './e-edit-product.component.html',
  styleUrl: './e-edit-product.component.scss',
})
export class EEditProductComponent {
  editor!: Editor | null; // Make it nullable
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize the editor only in the browser
      this.editor = new Editor();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.editor) {
      this.editor.destroy();
    }
  }

  // File Uploader
  public multiple: boolean = true;
}
