import { Component } from '@angular/core';
import { sideBarItems } from '../../../common/constants';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  sidebarItems = sideBarItems;

  // Accordion
  openSectionIndex: number = -1;
  openSectionIndex2: number = -1;
  openSectionIndex3: number = -1;
  toggleSection(index: number): void {
    if (this.openSectionIndex === index) {
      this.openSectionIndex = -1;
    } else {
      this.openSectionIndex = index;
    }
  }
  toggleSection2(index: number): void {
    if (this.openSectionIndex2 === index) {
      this.openSectionIndex2 = -1;
    } else {
      this.openSectionIndex2 = index;
    }
  }
  toggleSection3(index: number): void {
    if (this.openSectionIndex3 === index) {
      this.openSectionIndex3 = -1;
    } else {
      this.openSectionIndex3 = index;
    }
  }
  isSectionOpen(index: number): boolean {
    return this.openSectionIndex === index;
  }
  isSectionOpen2(index: number): boolean {
    return this.openSectionIndex2 === index;
  }
  isSectionOpen3(index: number): boolean {
    return this.openSectionIndex3 === index;
  }
}
