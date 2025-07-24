import { Component } from '@angular/core';
import { LoaderService } from './core/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss',
})
export class App {
  protected title = 'e-commerce-front';
  constructor(public readonly loaderService: LoaderService) {}
}
