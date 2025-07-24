import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IImageKit } from '../../../common/types/image-kit';
import { ImageKitService } from '../../../core/services/image-kit.service';

@Component({
  selector: 'app-multiple-fu',
  standalone: false,
  templateUrl: './multiple-fu.component.html',
  styleUrl: './multiple-fu.component.scss',
})
export class MultipleFuComponent {
  @Input() acceptedFileType?: string = '*/*';

  @Output() onSuccuss = new EventEmitter<IImageKit>();

  outputBoxVisible = false;
  progress = `0%`;
  uploadResult = '';
  fileName = '';
  fileSize = '';
  uploadStatus: number | undefined;
  uniqueId = `file-${Math.random().toString(36).substring(2, 10)}`;

  constructor(private readonly imageKitService: ImageKitService) {}

  ngOnInit(): void {}

  onFileSelected(event: any, inputFile: File | null) {
    this.outputBoxVisible = false;
    this.progress = `0%`;
    this.uploadResult = 'Uploading';
    this.fileName = '';
    this.fileSize = '';
    this.uploadStatus = undefined;
    const file: File = inputFile || event.target.files[0];

    if (!file) return;

    this.fileName = file.name;
    this.fileSize = `${(file.size / 1024).toFixed(2)} KB`;
    this.outputBoxVisible = true;

    this.imageKitService.upload(file).subscribe({
      next: (response: IImageKit) => {
        this.uploadStatus = 200;
        this.uploadResult = 'Uploaded';
        this.onSuccuss.emit(response);
      },
      error: (response: any) => {
        this.uploadStatus = 400;
        this.uploadResult = 'File upload failed!';
      },
      complete: () => {},
    });
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      const file: File = event.dataTransfer.files[0];
      this.onFileSelected(event, event.dataTransfer.files[0]);
    }
  }
}
